var columnsNumber = 12;
var rowsNumber = 9

function SquareSelection(coordinates) {
  var lowerX, lowerY, higherX, higherY, xDimension, yDimension;

  var proccessCoordinates =
      function(item, index) {
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
    // Test for each point
    if (isPointInside(
            squareSelection.getUpperLeftPoint()[0],
            squareSelection.getUpperLeftPoint()[1])) {
      return true;
    }
    if (isPointInside(
            squareSelection.getUpperRightPoint()[0],
            squareSelection.getUpperRightPoint()[1])) {
      return true;
    }
    if (isPointInside(
            squareSelection.getBottomLeftPoint()[0],
            squareSelection.getBottomLeftPoint()[1])) {
      return true;
    }
    if (isPointInside(
            squareSelection.getBottomRightPoint()[0],
            squareSelection.getBottomLeftPoint()[1])) {
      return true;
    }
    // Test if superior line pass through
    if (squareSelection.getLowerX() < lowerX &&
        squareSelection.getHigherX() > higherX &&
        squareSelection.getHigherY() >= lowerY &&
        squareSelection.getHigherY() <= higherY) {
      return true;
    }
    // Test if inferior line pass through
    if (squareSelection.getLowerX() < lowerX &&
        squareSelection.getHigherX() > higherX &&
        squareSelection.getLowerY() >= lowerY &&
        squareSelection.getLowerY() <= higherY) {
      return true;
    }
    // Test if left line pass through
    if (squareSelection.getLowerY() < lowerY &&
        squareSelection.getHigherY() > higherY &&
        squareSelection.getHigherX() >= lowerX &&
        squareSelection.getHigherX() <= higherX) {
      return true;
    }
    // Test if right line pass through
    if (squareSelection.getLowerY() < lowerY &&
        squareSelection.getHigherY() > higherY &&
        squareSelection.getLowerX() >= lowerX &&
        squareSelection.getLowerX() <= higherX) {
      return true;
    }
  }

  function isPointInside(x, y) {
    if (x >= lowerX && x <= higherX && y >= lowerY && y <= higherY) {
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
    getCoordinates: function() {
      return [
        [lowerX, higherY], [lowerX, lowerY], [higherX, lowerY],
        [higherX, higherY]
      ];
    },
    getExtensions: function() {
      return [lowerX, lowerY, higherX, higherY]
    },
    getLowerX: function() {
      return lowerX
    },
    getLowerY: function() {
      return lowerY
    },
    getHigherX: function() {
      return higherX
    },
    getHigherY: function() {
      return higherY
    },
    getXDimension: function() {
      return xDimension
    },
    getYDimension: function() {
      return yDimension
    },
    getUpperLeftPoint: function() {
      return [lowerX, higherY]
    },
    getUpperRightPoint: function() {
      return [higherX, higherY]
    },
    getBottomLeftPoint: function() {
      return [lowerX, lowerY]
    },
    getBottomRightPoint: function() {
      return [higherX, lowerY]
    },
    intersects: itIntersects,
    isInsideOf: itIsInsideOf,
  };

  return squareSelectionApi;
}

function initiateMap(elementId, colors, transparency) {
  var styles = {colors: colors, transparency: transparency}

  var eventHandlers = {
    mapMove: undefined,
    regionSelect: undefined,
    regionBoxSelect: undefined,
    regionSearch: undefined
  }

  var replacer = function(key, value) {
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
        'geometry': {'type': type, 'coordinates': geometry},
        'properties': value.tags
      };
    } else {
      return value;
    }
  };

  var tilePixels =
      new ol.proj.Projection({code: 'TILE_PIXELS', units: 'tile-pixels'});

  var map = new ol.Map({
    layers: [new ol.layer.Tile({name: 'tile', source: new ol.source.OSM()})],
    target: elementId,
    controls: [],
    view: new ol.View({
      center: [-4180799.456017701, -768009.2602094514],
      zoom: 6,
      maxZoom: 7,
      minZoom: 3,
      zoomFactor: 2
    }),
    interactions: ol.interaction.defaults({dragPan: true})
  });

  var gridArray = [];

  /** FUNCTIONS FOR GRID GENERATION **/
  var getTileStyle =
      function(feature, resolution) {
    var selectColor = [154, 154, 56, 0.2];

    for (var index = 0; index < styles.colors.length; index++) {
      var item = styles.colors[index];
      if ((item.minValue == undefined &&
           feature.get('processedImages') <= item.maxValue) ||
          (item.maxValue == undefined &&
           feature.get('processedImages') >= item.minValue) ||
          (feature.get('processedImages') >= item.minValue &&
           feature.get('processedImages') <= item.maxValue)) {
        selectColor = [item.r, item.g, item.b, styles.transparency];
        break;
      }
    }
    return new ol.style.Style({
      fill: new ol.style.Fill({color: selectColor}),
      stroke: new ol.style.Stroke({width: 1, color: [0, 0, 0, 1]})
    });
  }

  var generateGridFunc = function(featureCollection) {
    if (featureCollection) {
      var tileIndex = geojsonvt(featureCollection, {buffer: 2048});
      var vectorSource = new ol.source.VectorTile({
        format: new ol.format.GeoJSON(),
        tileLoadFunction: function(tile) {
          var format = tile.getFormat();
          var tileCoord = tile.getTileCoord();
          var data =
              tileIndex.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);

          var features = format.readFeatures(JSON.stringify(
              {type: 'FeatureCollection', features: data ? data.features : []},
              replacer));
          tile.setLoader(function() {
            tile.setFeatures(features);
            tile.setProjection(tilePixels);
          });
        },
        tileGrid: ol.tilegrid.createXYZ({maxZoom: 14}),
        url: 'data:'  // arbitrary url, we don't use it in the tileLoadFunction
      });
      var vectorLayer =
          new ol.layer.VectorTile({source: vectorSource, style: getTileStyle});
      map.addLayer(vectorLayer);
    } else {
      console.log('Tried to generate grid without features.');
    }
  };

  /// ********* INTERACTIONS **********************

  // a normal select interaction to handle click
  var select = new ol.interaction.Select();
  select.on('select', function(event) {
    event.deselected.forEach(function(polygon) {
      polygon.set('selected', false);
    });
    console.log('Selecionado: ' + event.selected.length)
    if (event.selected.length > 0) {
      var polygon = event.selected[0];
      polygon.set('selected', true);
    }
    if (eventHandlers.regionSelect !== undefined) {
      eventHandlers.regionSelect(polygon.get('UR'), polygon.get('LL'));
    }
  });
  // a DragBox interaction used to select features by drawing boxes
  var dragBox = new ol.interaction.DragBox(
      {condition: ol.events.condition.platformModifierKeyOnly});
  dragBox.on('boxend', function() {
    // features that intersect the box are added to the collection of
    // selected features, and their names are displayed in the "info"
    // div
    var info = [];
    var userSelection =
        SquareSelection(dragBox.getGeometry().getCoordinates()[0])
    // console.log(JSON.stringify(dragBox.getGeometry().getCoordinates()));


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
    } if (eventHandlers.regionBoxSelect !== undefined) {
      eventHandlers.regionBoxSelect(selectionInfos);
    }
  });
  // clear selection when drawing a new box and when clicking on the map
  dragBox.on('boxstart', function() {
    // selectedFeatures.clear();
    // Do anything else after this?
  });

  map.addInteraction(select);
  map.addInteraction(dragBox);
  map.on('click', function(event) {
    // var feature = map.forEachFeatureAtPixel(evt.pixel,
    //   function(feature) {
    //   return feature;
    // });

    // Do anything else after this?
  });
  map.on('moveend', function() {
    // console.log("moveend: ")

    if (eventHandlers.mapMove !== undefined) {
      eventHandlers.mapMove();
    }
  });
  map.on('movestart', function() {
    // console.log("movestart")

    if (eventHandlers.mapMove !== undefined) {
      eventHandlers.mapMove();
    }
  });

  // API
  var sapsMapAPI = {
    generateGrid: generateGridFunc,
    zoomIn: function() {
      // console.log("Applying zoom in");
      var view = map.getView();
      var zoom = view.getZoom();
      view.setZoom(zoom + 1);
    },
    zoomOut: function() {
      // console.log("Applying zoom out");
      var view = map.getView();
      var zoom = view.getZoom();
      view.setZoom(zoom - 1);
    },
    on: function(eventName, callbackFunction) {
      eventHandlers[eventName] = callbackFunction;
    }
  }

  return sapsMapAPI;
}