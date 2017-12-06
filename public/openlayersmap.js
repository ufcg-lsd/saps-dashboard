var columnsNumber = 12;
var rowsNumber = 9

function SquareSelection(coordinates) {

    var lowerX, lowerY, higherX, higherY, xDimension, yDimension;

    var proccessCoordinates = function (item, index) {
        if (Array.isArray(item) && index < 4) {
            if (!lowerX || item[0] < lowerX) {
                lowerX = item[0];
            }
            if (!lowerY || item[1] < lowerY) {
                lowerY = item[1];
            }
            if (!higherX || item[0] > higherX) {
                higherX = item[0];
            }
            if (!higherY || item[1] > higherY) {
                higherY = item[1];
            }
        } else {
            switch (index) {
                case 0:
                    lowerX = item;
                    break;
                case 1:
                    lowerY = item;
                    break;
                case 2:
                    higherX = item;
                    break;
                case 3:
                    higherY = item;
                    break;
                default:
                    break;
            }
        }

    }

    coordinates.forEach(proccessCoordinates);

    xDimension = (higherX - lowerX);
    yDimension = (higherY - lowerY);

    function itIntersects(squareSelection) {
        //Test for each point
        if (isPointInside(squareSelection.getUpperLeftPoint()[0], squareSelection.getUpperLeftPoint()[1])) {
            return true;
        }
        if (isPointInside(squareSelection.getUpperRightPoint()[0], squareSelection.getUpperRightPoint()[1])) {
            return true;
        }
        if (isPointInside(squareSelection.getBottomLeftPoint()[0], squareSelection.getBottomLeftPoint()[1])) {
            return true;
        }
        if (isPointInside(squareSelection.getBottomRightPoint()[0], squareSelection.getBottomLeftPoint()[1])) {
            return true;
        }
        //Test if superior line pass through
        if (squareSelection.getLowerX() < lowerX &&
            squareSelection.getHigherX() > higherX &&
            squareSelection.getHigherY() >= lowerY &&
            squareSelection.getHigherY() <= higherY) {
            return true;
        }
        //Test if inferior line pass through
        if (squareSelection.getLowerX() < lowerX &&
            squareSelection.getHigherX() > higherX &&
            squareSelection.getLowerY() >= lowerY &&
            squareSelection.getLowerY() <= higherY) {
            return true;
        }
        //Test if left line pass through
        if (squareSelection.getLowerY() < lowerY &&
            squareSelection.getHigherY() > higherY &&
            squareSelection.getHigherX() >= lowerX &&
            squareSelection.getHigherX() <= higherX) {
            return true;
        }
        //Test if right line pass through
        if (squareSelection.getLowerY() < lowerY &&
            squareSelection.getHigherY() > higherY &&
            squareSelection.getLowerX() >= lowerX &&
            squareSelection.getLowerX() <= higherX) {
            return true;
        }
    }

    function isPointInside(x, y) {
        if (x >= lowerX &&
            x <= higherX &&
            y >= lowerY &&
            y <= higherY) {
            return true;
        }
        return false;
    }

    function itIsInsideOf(squareSelection) {
        if (squareSelection.getLowerX() > lowerX ||
            squareSelection.getHigherY() < higherY ||
            squareSelection.getLowerY() > higherY ||
            squareSelection.getHigherX() < higherX) {
            return false;
        }

        return true;
    }

    var squareSelectionApi = {
        getCoordinates: function () {
            return [
                [lowerX, higherY],
                [lowerX, lowerY],
                [higherX, lowerY],
                [higherX, higherY]
            ];
        },
        getExtensions: function () {
            return [lowerX, lowerY, higherX, higherY]
        },
        getLowerX: function () {
            return lowerX
        },
        getLowerY: function () {
            return lowerY
        },
        getHigherX: function () {
            return higherX
        },
        getHigherY: function () {
            return higherY
        },
        getXDimension: function () {
            return xDimension
        },
        getYDimension: function () {
            return yDimension
        },
        getUpperLeftPoint: function () {
            return [lowerX, higherY]
        },
        getUpperRightPoint: function () {
            return [higherX, higherY]
        },
        getBottomLeftPoint: function () {
            return [lowerX, lowerY]
        },
        getBottomRightPoint: function () {
            return [higherX, lowerY]
        },
        intersects: itIntersects,
        isInsideOf: itIsInsideOf,
    };

    return squareSelectionApi;
}

function initiateMap(elementId) {

    var eventHandlers = {
        mapMove: undefined,
        regionSelect: undefined,
        regionBoxSelect: undefined,
        regionSearch: undefined
    }

    var replacer = function (key, value) {
        if (value.geometry) {
            var type;
            var rawType = value.type;
            var geometry = value.geometry;

            if (rawType === 1) {
                type = 'MultiPoint';
                if (geometry.length == 1) {
                    type = 'Point';
                    geometry = geometry[0];
                }
            } else if (rawType === 2) {
                type = 'MultiLineString';
                if (geometry.length == 1) {
                    type = 'LineString';
                    geometry = geometry[0];
                }
            } else if (rawType === 3) {
                type = 'Polygon';
                if (geometry.length > 1) {
                    type = 'MultiPolygon';
                    geometry = [geometry];
                }
            }

            return {
                'type': 'Feature',
                'geometry': {
                    'type': type,
                    'coordinates': geometry
                },
                'properties': value.tags
            };
        } else {
            return value;
        }
    };

    var tilePixels = new ol.proj.Projection({
        code: 'TILE_PIXELS',
        units: 'tile-pixels'
    });

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                name: "tile",
                source: new ol.source.OSM()
            })
        ],
        target: elementId,
        controls: [],
        view: new ol.View({
            center: [-46000000, -1300000],
            zoom: 5,
            maxZoom: 10,
            minZoom: 2,
            zoomFactor: 2
        }),
        interactions: ol.interaction.defaults({
            dragPan: true
        })
    });

    var gridArray = [];

    /** FUNCTIONS FOR GRID GENERATION **/
    var generateGridFunc = function (featureCollection) {
        if (featureCollection) {
            var tileIndex = geojsonvt(featureCollection, {
                extent: 4096,
                debug: 1
            });
            var vectorSource = new ol.source.VectorTile({
                format: new ol.format.GeoJSON(),
                tileLoadFunction: function (tile) {
                    var format = tile.getFormat();
                    var tileCoord = tile.getTileCoord();
                    var data = tileIndex.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);
                    console.log(data)

                    var features = format.readFeatures(
                        JSON.stringify({
                            type: 'FeatureCollection',
                            features: data ? data.features : []
                        }, replacer));
                    tile.setLoader(function () {
                        tile.setFeatures(features);
                        tile.setProjection(tilePixels);
                    });
                },
                tileGrid: ol.tilegrid.createXYZ({maxZoom: 12}),
                url: 'data:' // arbitrary url, we don't use it in the tileLoadFunction
            });
            var vectorLayer = new ol.layer.VectorTile({
                source: vectorSource
            });
            map.addLayer(vectorLayer);
        } else {
            console.log("Tried to generate grid without features.");
        }
    };

    function createNewRegion(regionName, regionId, polygonCoords, lngLat) {
        var polygonFeature = new ol.Feature(
            new ol.geom.Polygon([polygonCoords])
        );

        var heatMap = new ol.style.Fill({
            color: [255, 255, 255, 0]
        });
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 1,
                color: [0, 0, 0, 1]
            }),
            fill: heatMap
        });

        polygonFeature.setStyle(style);
        polygonFeature.set("regionName", regionName);
        polygonFeature.set("regionId", regionId);
        polygonFeature.set("lngLat", lngLat);

        var newLayerVector = new ol.layer.Vector({
            regionName: regionName,
            regionId: regionId,
            lngLat: lngLat,
            coordinates: polygonCoords,
            source: new ol.source.Vector({
                features: [polygonFeature],
                wrapX: true
            })
        })
        // console.log("Adding new region to grid: "+newLayerVector.get("regionName"));
        return newLayerVector;
    }

    var getVisibleUnloadedRegions = function () {
        extent = mapView.calculateExtent(map.getSize());
        var mapSelection = SquareSelection(extent);

        var visibleRegions = []
        var gridLayerGroup = undefined;

        map.getLayers().forEach(function (item, index) {
            if (item.get("name") == "gridLayer") {
                gridLayerGroup = item;
            }

        });

        if (gridLayerGroup) {
            gridLayerGroup.getLayers().forEach(function (item, index) {
                var regionSelection = SquareSelection(item.get("coordinates"));
                if (regionSelection.isInsideOf(mapSelection) ||
                    regionSelection.intersects(mapSelection)) {
                    console.log("Visible region found: " + item.getKeys())
                    visibleRegions.push(item.get("regionName"))
                }
            })
        }
        //console.log("Returning "+JSON.stringify(visibleRegions));
        return visibleRegions;
    }

    var updateRegionMapColor = function (regionDetail) {

        var heatMap = new ol.style.Fill({
            color: [255, 255, 255, 0]
        })

        if (regionDetail.color && regionDetail.color.length == 4) {
            heatMap = new ol.style.Fill({
                color: regionDetail.color
            })
        }

        var gridLayerGroup;

        map.getLayers().forEach(function (item, index) {
            if (item.get("name") == "gridLayer") {
                gridLayerGroup = item;
            }

        });

        gridLayerGroup.getLayers().forEach(function (item, index) {
            //ITEM: newLayerVector
            if (item.get("regionName") == regionDetail.regionName) {
                //item.set("regionDetail",regionDetail);
                var source = item.getSource();
                var features = source.getFeatures();
                // console.log(JSON.stringify(features))
                var polygon = features[0];
                polygon.set("regionName", regionDetail.regionName)
                polygon.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: 1,
                        color: [0, 0, 0, 1]
                    }),
                    fill: heatMap
                }));
            }
        })

    }

    var getRegionsByName = function (regionName) {

        var regionsName = [];

        map.getLayers().forEach(function (item, index) {

            if (item.get("name") == "gridLayer") {
                gridLayerGroup = item;
            }

        });

        if (gridLayerGroup) {
            gridLayerGroup.getLayers().forEach(function (item, index) {
                var regionSelection = SquareSelection(item.get("coordinates"));
                if (regionsDetails.length < 11) {
                    var source = item.getSource();
                    var features = source.getFeatures();
                    var polygon = features[0];
                    if (polygon.get('regionName') != undefined) {
                        regionsName.push(polygon.get('regionName'))
                    }
                }
                // if(regionName == item.get("regionName")){
                //   var source = item.getSource();
                //   var features = source.getFeatures();
                //   var polygon = features[0];
                //   regionsDetails.push(polygon.get("regionDetail"))
                // }
            })
        }
        return regionsName;
    }

    /// ********* INTERACTIONS **********************

    // a normal select interaction to handle click
    var select = new ol.interaction.Select();
    select.cleanSelectionStyle = function (polygon) {
        if (polygon != undefined) {
            var style = polygon.getStyle();
            if (style) {
                style.setStroke(new ol.style.Stroke({
                    width: 1,
                    color: [0, 0, 0, 1]
                }));
                var fill = style.getFill();
                var color = fill.getColor();
                color[3] = 0.25;
                fill.setColor(color);
            }
        }
    };
    select.applySelectionStyle = function (polygon) {
        if (polygon != undefined) {
            var style = polygon.getStyle();
            if (style) {
                style.setStroke(new ol.style.Stroke({
                    width: 4,
                    color: [0, 125, 111, 1]
                }));
                var fill = style.getFill();
                var color = fill.getColor();
                color[3] = 0.5;
                fill.setColor(color);
            }
        }
    };
    select.on('select', function (event) {
        // This cancel multiple select by holding shift key
        event.deselected.forEach(function (polygon) {
            this.cleanSelectionStyle(polygon);
        }, this);

        console.log("Selecionado: " + event.selected.length)
        if (event.selected.length > 0) {
            var polygon = event.selected[0];
            this.applySelectionStyle(polygon);
        }
        if (eventHandlers.regionSelect !== undefined) {
            eventHandlers.regionSelect(polygon.get('lngLat'));
        }
    });
    // a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
    });
    dragBox.on('boxend', function () {
        // features that intersect the box are added to the collection of
        // selected features, and their names are displayed in the "info"
        // div
        var info = [];
        var userSelection = SquareSelection(dragBox.getGeometry().getCoordinates()[0])
        //console.log(JSON.stringify(dragBox.getGeometry().getCoordinates()));


        var gridSquareSelecteds = 0;
        for (var count = 0; count < gridArray.length; count++) {
            if (gridArray[count].intersects(userSelection) ||
                gridArray[count].isInsideOf(userSelection)) {
                gridSquareSelecteds++;
            }
        }
        selectionInfos = {
            coordinates: userSelection.getCoordinates(),
            quaresSelected: gridSquareSelecteds
        }
        if (eventHandlers.regionBoxSelect !== undefined) {
            eventHandlers.regionBoxSelect(selectionInfos);
        }

    });
    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
        // selectedFeatures.clear();
        //Do anything else after this?
    });

    map.addInteraction(select);
    map.addInteraction(dragBox);
    map.on('click', function (event) {
        // var feature = map.forEachFeatureAtPixel(evt.pixel,
        //   function(feature) {
        //   return feature;
        // });

        //Do anything else after this?
    });
    map.on('moveend', function () {
        //console.log("moveend: ")

        if (eventHandlers.mapMove !== undefined) {
            eventHandlers.mapMove();
        }

    });
    map.on('movestart', function () {
        //console.log("movestart")

        if (eventHandlers.mapMove !== undefined) {
            eventHandlers.mapMove();
        }

    });

    //API
    var sapsMapAPI = {
        generateGrid: generateGridFunc,
        getVisibleUnloadedRegions: getVisibleUnloadedRegions,
        updateRegionMapColor: updateRegionMapColor,
        getRegionsByName: getRegionsByName,
        zoomIn: function () {
            //console.log("Applying zoom in");
            var view = map.getView();
            var zoom = view.getZoom();
            view.setZoom(zoom + 1);
        },
        zoomOut: function () {
            //console.log("Applying zoom out");
            var view = map.getView();
            var zoom = view.getZoom();
            view.setZoom(zoom - 1);
        },
        on: function (eventName, callbackFunction) {
            eventHandlers[eventName] = callbackFunction;
        }
    }

    return sapsMapAPI;
}