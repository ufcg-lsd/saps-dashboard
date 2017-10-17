var columnsNumber = 12;
var rowsNumber = 9

function SquareSelection(coordinates){
  
  var lowerX, lowerY, higherX, higherY, xDimension, yDimension;

  var proccessCoordinates = function(item, index){
    if(Array.isArray(item) && index < 4){
      if(!lowerX || item[0] < lowerX){
        lowerX = item[0];
      }
      if(!lowerY || item[1] < lowerY){
        lowerY = item[1];
      }
      if(!higherX || item[0] > higherX){
        higherX = item[0];
      }
      if(!higherY || item[1] > higherY){
        higherY = item[1];
      }
    }else{
      switch(index){
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

  function itIntersects(squareSelection){
    //Test for each point
    if(isPointInside(squareSelection.getUpperLeftPoint()[0], squareSelection.getUpperLeftPoint()[1])){
      return true;
    }
    if(isPointInside(squareSelection.getUpperRightPoint()[0], squareSelection.getUpperRightPoint()[1])){
      return true;
    }
    if(isPointInside(squareSelection.getBottomLeftPoint()[0], squareSelection.getBottomLeftPoint()[1])){
      return true;
    }
    if(isPointInside(squareSelection.getBottomRightPoint()[0], squareSelection.getBottomLeftPoint()[1])){
      return true;
    }
    //Test if superior line pass through
    if(squareSelection.getLowerX() < lowerX &&
        squareSelection.getHigherX() > higherX && 
        squareSelection.getHigherY() >= lowerY &&
        squareSelection.getHigherY() <= higherY){
      return true;
    }
    //Test if inferior line pass through
    if(squareSelection.getLowerX() < lowerX &&
        squareSelection.getHigherX() > higherX && 
        squareSelection.getLowerY() >= lowerY &&
        squareSelection.getLowerY() <= higherY){
      return true;
    }
    //Test if left line pass through
    if(squareSelection.getLowerY() < lowerY &&
        squareSelection.getHigherY() > higherY && 
        squareSelection.getHigherX() >= lowerX &&
        squareSelection.getHigherX() <= higherX){
      return true;
    }
    //Test if right line pass through
    if(squareSelection.getLowerY() < lowerY &&
        squareSelection.getHigherY() > higherY && 
        squareSelection.getLowerX() >= lowerX &&
        squareSelection.getLowerX() <= higherX){
      return true;
    }
  }

  function isPointInside(x,y){
    if(x >= lowerX &&
       x <= higherX &&
       y >= lowerY &&
       y <= higherY){
      return true;
    }
    return false;
  }

  function itIsInsideOf(squareSelection){
    if(squareSelection.getLowerX() > lowerX ||
       squareSelection.getHigherY() < higherY ||
       squareSelection.getLowerY() > higherY ||
       squareSelection.getHigherX() < higherX ){
      return false;
    }
    
    return true;
  }

  var squareSelectionApi = {
     getCoordinates: function(){return [[lowerX,higherY],[lowerX,lowerY],[higherX,lowerY],[higherX,higherY]];},
     getExtensions: function(){return [lowerX, lowerY, higherX, higherY]},
     getLowerX: function(){return lowerX},
     getLowerY: function(){return lowerY},
     getHigherX: function(){return higherX},
     getHigherY: function(){return higherY},
     getXDimension: function(){return xDimension},
     getYDimension: function(){return yDimension},
     getUpperLeftPoint: function(){return [lowerX,higherY]},
     getUpperRightPoint: function(){return [higherX,higherY]},
     getBottomLeftPoint: function(){return [lowerX,lowerY]},
     getBottomRightPoint: function(){return [higherX,lowerY]},
     intersects: itIntersects,
     isInsideOf: itIsInsideOf,
  };

  return squareSelectionApi;
}

function initiateMap(elementId){
  
  var eventHandlers = {
    mapMove:undefined,
    regionSelect:undefined,
    regionBoxSelect:undefined,
    regionSearch:undefined
  }

  /** MAP INITIALIZATION **/
  var vectorSource = new ol.source.Vector({
    url: 'https://openlayers.org/en/v3.20.1/examples/data/geojson/countries.geojson',
    format: new ol.format.GeoJSON()
  });

  var osmSource = new ol.source.OSM();

  var mapLayers = [
      new ol.layer.Tile({
        name: "tile",
        source: osmSource
      }),
      new ol.layer.Vector({
        name: "vector",
        source: vectorSource
  })];
  var mapView = new ol.View({
      center: [-4180799.456017701,-768009.2602094514],
      zoom: 9,
      maxZoom:14,
      minZoom:4,
      zoomFactor: 2
  })

  var map = new ol.Map({
    layers: mapLayers,
    target: elementId,
    controls: [],
    view: mapView,
    interactions: ol.interaction.defaults({
      dragPan: true
    })
  });

  var gridArray = [];
  

  /** FUNCTIONS FOR GRID GENERATION **/
  var generateGridFunc = function(regions){

    var gridLayers = [];

    if(regions){
      //console.log("regions: "+JSON.stringify(regions))
      regions.forEach(function(item, index){
        //console.log("Region: "+JSON.stringify(item));
        var polygonCoords = [
          item.coordinates[0],
          item.coordinates[1],
          item.coordinates[2],
          item.coordinates[3]
        ];

        gridLayers.push(createNewRegion(item.regionName, item.regionId, polygonCoords));

        var newSquare = SquareSelection(polygonCoords);
        gridArray.push(newSquare)
      })

    }else{

      extent = mapView.calculateExtent(map.getSize());
      var mapSelection = SquareSelection(extent);

      var xFactor = (mapSelection.getXDimension() / columnsNumber);
      var yFactor = (mapSelection.getYDimension() / rowsNumber);

      map.getLayers().forEach(function(layer, i) {
        if (layer instanceof ol.layer.Group) {
          //console.log('Removing Group Layer');
          map.removeLayer(layer);
        }
      });

      var actualLX, actualLY, actualHX, actualHY;
      

      for(var latCount = 1; latCount <= rowsNumber; latCount++){
        for(var longCount = 1; longCount <= columnsNumber; longCount++){
            actualLX = mapSelection.getLowerX() + (xFactor*(longCount-1));
            actualHX = mapSelection.getLowerX() + (xFactor*longCount);
            actualLY = mapSelection.getHigherY() - (yFactor*latCount);
            actualHY = mapSelection.getHigherY() - (yFactor*(latCount-1));
            var polygonCoords = [[actualLX,actualHY],[actualLX,actualLY],[actualHX,actualLY],[actualHX,actualHY]];
            
            gridLayers.push(createNewRegion(polygonCoords));

            var newSquare = SquareSelection(polygonCoords);
            gridArray.push(newSquare)
        }
      }
    }

    var gridGroupLayers = new ol.layer.Group({
          name: "gridLayer",
          layers: gridLayers
    });
    
    map.addLayer(gridGroupLayers);
      
  }; 

  function createNewRegion(regionName, regionId, polygonCoords){

    var polygonFeature = new ol.Feature(
    new ol.geom.Polygon([polygonCoords]));

    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 1,
          color: [0, 0, 0, 1]
        }),
        fill: heatMap
    });

    polygonFeature.setStyle(style);
    polygonFeature.set("regionName",regionName);
    polygonFeature.set("regionId",regionId);

    var heatMap = new ol.style.Fill({
          color: [255, 255, 255, 0]
    })
    
    var newLayerVector =  new ol.layer.Vector(
    { 
      regionName: regionName,
      regionId: regionId,
      coordinates: polygonCoords,
      source: new ol.source.Vector({
        features: [polygonFeature]
      }),
      
    })
    // console.log("Adding new region to grid: "+newLayerVector.get("regionName"));
    return newLayerVector;
  }
  
  var getVisibleUnloadedRegions = function(){
    extent = mapView.calculateExtent(map.getSize());
    var mapSelection = SquareSelection(extent);

    var visibleRegions = []
    var gridLayerGroup = undefined;

    map.getLayers().forEach(function(item, index){
      if(item.get("name") == "gridLayer"){
        gridLayerGroup = item;
      }
            
    });

    if(gridLayerGroup){
      gridLayerGroup.getLayers().forEach(function(item, index){
          var regionSelection = SquareSelection(item.get("coordinates"));
          if(regionSelection.isInsideOf(mapSelection) 
            || regionSelection.intersects(mapSelection)){
            console.log("Visible region found: "+item.getKeys())
            visibleRegions.push(item.get("regionName"))  
          }
      })
    }
    //console.log("Returning "+JSON.stringify(visibleRegions));
    return visibleRegions;
  }

  var updateRegionMapColor = function (regionDetail){

    var heatMap = new ol.style.Fill({
          color: [255, 255, 255, 0]
    })

    if(regionDetail.color && regionDetail.color.length == 4){
      heatMap = new ol.style.Fill({
           color: regionDetail.color
      })
    }
    
    var gridLayerGroup;

    map.getLayers().forEach(function(item, index){
      if(item.get("name") == "gridLayer"){
        gridLayerGroup = item;
      }
            
    });

    gridLayerGroup.getLayers().forEach(function(item, index){
      //ITEM: newLayerVector
      if(item.get("regionName") == regionDetail.regionName){
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
  var getRegionsByName = function(regionName){
    
    var regionsName = [];

    map.getLayers().forEach(function(item, index){

      if(item.get("name") == "gridLayer"){
        gridLayerGroup = item;
      }
            
    });

    if(gridLayerGroup){
      gridLayerGroup.getLayers().forEach(function(item, index){
          var regionSelection = SquareSelection(item.get("coordinates"));
          if(regionsDetails.length < 11){
            var source = item.getSource();
            var features = source.getFeatures();
            var polygon = features[0];
            if(polygon.get('regionName') != undefined){
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
  select.previous = undefined;
  select.cleanSelectionStyle = function(polygon){
    if(polygon != undefined){
      //console.log("Previous: "+polygon.get("regionName"))
      var style = this.previous.getStyle();
      if(style){
        style.setStroke(new ol.style.Stroke({
              width: 1,
              color: [0, 0, 0, 1]
        }));
        var fill = style.getFill();
        var color = fill.getColor();
        color[3] = 0.5; 
        fill.setColor(color);
      }else{
        // var style = new ol.style.Style({
        //   stroke: new ol.style.Stroke({
        //     width: 1,
        //     color: [0, 0, 0, 1]
        //   }),
        //   fill: new ol.style.Fill({
        //     color: [255, 255, 255, 0]
        //   })
        // });
        // polygon.setStyle(style);
      }
    }
  };
  select.applySelectionStyle = function(polygon){
    if(polygon != undefined){
      var style = polygon.getStyle();
      if(style){
        style.setStroke(new ol.style.Stroke({
              width: 4,
              color: [0, 125, 111, 1]
        }));
        var fill = style.getFill();
        var color = fill.getColor();
        color[3] = 1; 
        fill.setColor(color);
      }else{
        // var style = new ol.style.Style({
        //   stroke: new ol.style.Stroke({
        //     width: 1,
        //     color: [0, 0, 0, 1]
        //   }),
        //   fill: new ol.style.Fill({
        //     color: [255, 255, 255, 0]
        //   })
        // });
        // polygon.setStyle(style);
      }
    }
  }
  // a DragBox interaction used to select features by drawing boxes
  var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly
  });

  map.addInteraction(select);
  map.addInteraction(dragBox);

  select.on('select', function(event){

    // This cancel multiple select by holding shift key
    this.cleanSelectionStyle(this.previous);

    console.log("Selecionado: "+event.selected.length)
    //polygonFeature
    if(event.selected[0] != undefined){

      var polygon = event.selected[0];
      this.previous = polygon;
      this.applySelectionStyle(this.previous);
      if(eventHandlers.regionSelect !== undefined){
        eventHandlers.regionSelect(polygon.get('regionName'));  
      }
    }
    

  });

  dragBox.on('boxend', function() {
    // features that intersect the box are added to the collection of
    // selected features, and their names are displayed in the "info"
    // div
    var info = [];
    var userSelection = SquareSelection(dragBox.getGeometry().getCoordinates()[0])
    //console.log(JSON.stringify(dragBox.getGeometry().getCoordinates()));
    

    var gridSquareSelecteds = 0;
    for(var count=0; count < gridArray.length; count++){
      if(gridArray[count].intersects(userSelection) || 
        gridArray[count].isInsideOf(userSelection)){
        gridSquareSelecteds++;
      }
    }
    selectionInfos = {
      coordinates: userSelection.getCoordinates(),
      quaresSelected: gridSquareSelecteds
    }
    if(eventHandlers.regionBoxSelect !== undefined){
      eventHandlers.regionBoxSelect(selectionInfos);  
    }
    
  });

  // clear selection when drawing a new box and when clicking on the map
  dragBox.on('boxstart', function() {
    selectedFeatures.clear();
    //Do anything else after this?
  });
  map.on('click', function(event) {
    // var feature = map.forEachFeatureAtPixel(evt.pixel,
    //   function(feature) {
    //   return feature;
    // });
    
    //Do anything else after this?
  });
  map.on('moveend', function() {
    //console.log("moveend: ")
    
    if(eventHandlers.mapMove !== undefined){
      eventHandlers.mapMove();
    }
    
  });

  map.on('movestart', function() {
    //console.log("movestart")
    
    if(eventHandlers.mapMove !== undefined){
      eventHandlers.mapMove();
    }
    
  });

  

  //API
  var sapsMapAPI = {
    generateGrid: generateGridFunc,
    getVisibleUnloadedRegions: getVisibleUnloadedRegions,
    updateRegionMapColor: updateRegionMapColor,
    getRegionsByName:getRegionsByName,
    zoomIn: function() {
      //console.log("Applying zoom in");
      var view = map.getView();
      var zoom = view.getZoom();
      view.setZoom(zoom + 1);
    },
    zoomOut: function() {
      //console.log("Applying zoom out");
      var view = map.getView();
      var zoom = view.getZoom();
      view.setZoom(zoom - 1);
    },
    on: function(eventName, callbackFunction){
      eventHandlers[eventName]=callbackFunction;
    }
  }

  return sapsMapAPI;
}