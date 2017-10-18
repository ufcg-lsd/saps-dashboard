var dashboardControllers = angular.module('dashboardControllers');

dashboardControllers.controller('RegionController', function($scope, $rootScope,
    $log, $filter, $http, $timeout, AuthenticationService, RegionService, EmailService,
    GlobalMsgService, appConfig) {

    //Region detail example
    /*
    region : {
      "regionId":"",
      "name":"",
      "coordinates":[[-4730840.311557829,-576916.6894965108],[-4730840.311557829,-619381.7052104976],[-4639166.835634475,-619381.7052104976],[-4639166.835634475,-576916.6894965108]],
      "regionDetail":{
        "regionName":"",
        "totalImages":100,
        "processedImages":[processedImageObject],

      }
    }
    processedImage:{
      "name":"img_01",
      "date":"2012-04-05",
      "outputs":[  
        {  
        "satelliteName":"L5",
        "preProcessingScrip":"pre-script01",
        "processingScrip":"script01",
        "link":"http://localhost:9080/images/img01"
        }
      ]
      "totalImgBySatelitte":[
        {name:"L4", total:0}
      ]
    }
    */

    var selectedRegion;
    $scope.searchedRegions = [];
    $scope.regionsDetails = [];
    var loadedregions = [];

    //Variables for interface controler
    $scope.satelliteOpts = appConfig.SATELLITE_OPTS;
    $scope.linksSelected = false;
    $scope.allDetailsChecked = false;

    // Script options
    $scope.processingScripts = [{
        name: 'DEFAULT',
        value: 'default_script'
    }, {
        name: 'Script-01',
        value: 'scp-01'
    }, {
        name: 'Script-02',
        value: 'scp-02'
    }, ]


    $scope.preProcessingScripts = [{
        name: 'DEFAULT',
        value: 'default_pre-script'
    }, {
        name: 'Pre-Script-01',
        value: 'pscp-01'
    }, {
        name: 'Pre-Script-02',
        value: 'pscp-02'
    }, ]

    //Initializing data picker
    $(function() {
        $('.saps-datepicker').datetimepicker({
            format: 'DD/MM/YYYY'
        });
    });

    // Filters for region search
    $scope.searchFilters = {
        generalSearch: '',
        regionFilter: '',
        processingScriptName: $scope.processingScripts[0].name,
        processingScriptValue: $scope.processingScripts[0].value,
        preProcessingScriptName: $scope.preProcessingScripts[0].name,
        preProcessingScriptValue: $scope.preProcessingScripts[0].value,
        satellite: ''
    };

    //-------- BEGIN- Methods for action on MAP --------//

    //Initializing saps map
    var sapsMap = initiateMap("map");

    //Handle for action of selecting an specific region on map
    function selectRegionOnMap(regionName) {
        if (regionName === undefined) {
            $scope.$apply(function() {
                $scope.searchFilters.regionFilter = "";
                if (! $('#sb-map-feature-options').hasClass("sb-hidden")) {
                    $('#sb-map-feature-options').addClass("sb-hidden");
                }
            });
        } else {
            $scope.$apply(function() {
                $scope.searchFilters.regionFilter = regionName;
                if ($('#sb-map-feature-options').hasClass("sb-hidden")) {
                    $('#sb-map-feature-options').removeClass("sb-hidden");
                }
            });
        }
    };

    function callbackBoxSelectionInfo(selectionInfo) {
        $scope.message = 'Selection: ' + JSON.stringify(selectionInfo);
        $scope.$apply(); //This is for apply the modification avbove, that is made by callback.
        if (selectionInfo.quaresSelected > 4) {
            alert('Invalid selection!! You can\'t select more than 4 regions on the grid.');
        } else {
            alert('Selection at :' + JSON.stringify(selectionInfo));
        }

    };

    //Method called when a zoom or moviment is applied to the saps map.
    // function updateVisibleRegions(){


    //   var visibleReqionNames = sapsMap.getVisibleUnloadedRegions();

    //   if(visibleReqionNames.length > 0){

    //     RegionService.getRegionsDetails(visibleReqionNames, 
    //     function(data){

    //       data.forEach(function(regionDetail ,index){

    //         var transparency = $rootScope.heatMap.transparency;

    //         for(var index = 0; index < $rootScope.heatMap.colours.length; index++){

    //           var item = $rootScope.heatMap.colours[index];

    //           if( (item.minValue == undefined && regionDetail.processedImages.length <= item.maxValue) ||
    //               (item.maxValue == undefined && regionDetail.processedImages.length >= item.minValue) ||
    //               (regionDetail.processedImages.length >= item.minValue && regionDetail.processedImages.length <= item.maxValue) ){

    //             regionDetail.color = [item.r, item.g, item.b, transparency];
    //             regionDetail.cssColor = "rgb("+item.r+","+item.g+","+item.b+")"
    //             break;
    //           }

    //         };
    //         //TODO update regions on memory
    //         sapsMap.updateRegionMapColor(regionDetail);
    //       });
    //     },
    //     function(error){
    //       GlobalMsgService.pushMessageFail("Erro while trying to load regions' information: "+error)
    //     });
    //   }

    //}

    //sapsMap.on('mapMove',updateVisibleRegions)
    sapsMap.on('regionSelect', selectRegionOnMap)
    sapsMap.on('regionBoxSelect', callbackBoxSelectionInfo)

    //-------- END- Methods for action on MAP --------//

    function loadRegions() {

        RegionService.getRegions(
            function(response) {
                sapsMap.generateGrid(response);

                response.forEach(function(region, index) {

                    if (region.regionDetail && region.regionDetail.processedImages) {
                        processRegionHeatmap(region);
                        sapsMap.updateRegionMapColor(region.regionDetail);
                    }

                });

                loadedregions = response;


            },
            function(error) {
                console.log('Error while trying to ge regions: ' + error)
            }
        );
    }

    function processRegionHeatmap(region) {
        var transparency = $rootScope.heatMap.transparency;

        for (var index = 0; index < $rootScope.heatMap.colours.length; index++) {

            var item = $rootScope.heatMap.colours[index];

            if ((item.minValue == undefined && region.regionDetail.processedImages.length <= item.maxValue) ||
                (item.maxValue == undefined && region.regionDetail.processedImages.length >= item.minValue) ||
                (region.regionDetail.processedImages.length >= item.minValue && region.regionDetail.processedImages.length <= item.maxValue)) {

                region.regionDetail.color = [item.r, item.g, item.b, transparency];
                region.regionDetail.cssColor = "rgb(" + item.r + "," + item.g + "," + item.b + ")";
                break;
            }
        };
    }

    loadRegions();

    //Interface controls
    $scope.changeProcScript = function(newScriptOpt) {
        $scope.searchFilters.processingScriptName = newScriptOpt.name;
        $scope.searchFilters.processingScriptValue = newScriptOpt.value;
    };


    $scope.changePreProcScript = function(newScriptOpt) {
        $scope.searchFilters.preProcessingScriptName = newScriptOpt.name;
        $scope.searchFilters.preProcessingScriptValue = newScriptOpt.value;
    }

    $scope.submitSearch = function() {

        var isAnd = true;
        $scope.searchedRegions = [];

        console.log("Date: " + $('#search-first-year-input').val() + " -- " + $('#search-last-year-input').val())

        if ($rootScope.validateDate($('#search-first-year-input').val())) {
            $scope.searchFilters.initialDate = $rootScope.parseDate($('#search-first-year-input').val())
        }

        if ($rootScope.validateDate($('#search-last-year-input').val())) {
            $scope.searchFilters.finalDate = $rootScope.parseDate($('#search-last-year-input').val())
        }

        if ($scope.searchFilters.initialDate > $scope.searchFilters.finalDate) {
            console.log("Last year date must be greater than first year date")
            $scope.modalMsgError = "Last year date must be greater than first year date";
        }

        console.log('searchFilters = ' + JSON.stringify($scope.searchFilters))

        loadedregions.forEach(function(region, index) {

            var matches = false;
            var filterNameOk = false;
            var filterTagsOk = true;
            var filterRegionOk = true;


            var selectedRegion = {
                regionName: undefined,
                processedImages: [],
                color: undefined,
                cssColor: undefined
            }

            if (region.regionName && region.regionDetail) {

                if ($rootScope.validateString($scope.searchFilters.regionFilter)) {
                    if (region.regionName.toLowerCase() == $scope.searchFilters.regionFilter.toLowerCase() ||
                        region.regionName.toLowerCase().includes($scope.searchFilters.regionFilter.toLowerCase())) {
                        console.log("Nome ok")
                        filterNameOk = true;
                        selectedRegion.regionName = region.regionName;
                        selectedRegion.color = region.regionDetail.color;
                        selectedRegion.cssColor = region.regionDetail.cssColor;
                    }
                }
                //TODO verificar com Chico como deve ser esse campo "Keywords and Tags"
                // if($rootScope.validateString($scope.searchFilters.generalSearch)){
                //   if(!region.name.toLowerCase().includes($scope.searchFilters.generalSearch.toLowerCase())){
                //     matches = false;
                //   }
                // }
                if (filterNameOk && region.regionDetail.processedImages) {



                    region.regionDetail.processedImages.forEach(function(image, ind) {

                        console.log("Verifing: " + JSON.stringify(image))

                        image.totalImgBySatelitte = [{
                            name: "L4",
                            total: 0
                        }, {
                            name: "L5",
                            total: 0
                        }, {
                            name: "L7",
                            total: 0
                        }]

                        console.log("Testing image " + JSON.stringify(image))

                        var filterSatelliteOk = false;
                        var filterInitialDateOk = false;
                        var filterFinalDateOk = false;
                        var filterProcessingScriptOk = false;
                        var filterPreProcessingScriptOk = false;

                        if ($scope.searchFilters.initialDate && $scope.searchFilters.finalDate) {

                            var imageDate = imageDate = $rootScope.parseDateUS(image.date);

                            if (imageDate >= $scope.searchFilters.initialDate &&
                                imageDate <= $scope.searchFilters.finalDate) {
                                console.log("Dates ok")
                                filterInitialDateOk = true;
                                filterFinalDateOk = true;
                            }
                        }
                        for (var i = 0; i < image.outputs.length; i++) {

                            image.totalImgBySatelitte.forEach(function(totalSat, z) {

                                console.log("Comparing " + image.outputs[i].satelliteName.toLowerCase() + " and " + totalSat.name.toLowerCase())

                                if (image.outputs[i].satelliteName.toLowerCase() == totalSat.name.toLowerCase()) {
                                    console.log("Incrementing " + JSON.stringify(totalSat))
                                    totalSat.total = ++totalSat.total;
                                }
                            })

                            if ($rootScope.validateString($scope.searchFilters.satellite)) {
                                if ($scope.searchFilters.satellite.toLowerCase() == image.outputs[i].satelliteName.toLowerCase()) {
                                    console.log("Satelites ok")
                                    filterSatelliteOk = true;
                                }
                            }
                            if ($rootScope.validateString($scope.searchFilters.processingScriptValue)) {
                                if ($scope.searchFilters.processingScriptValue == image.outputs[i].processingScript) {
                                    console.log("Process Script ok")
                                    filterProcessingScriptOk = true;
                                }
                            }
                            if ($rootScope.validateString($scope.searchFilters.preProcessingScriptValue)) {
                                if ($scope.searchFilters.preProcessingScriptValue == image.outputs[i].preProcessingScript) {
                                    console.log("Pre Process Script ok")
                                    filterPreProcessingScriptOk = true;
                                }
                            }
                        }

                        if (isAnd) {
                            if (filterSatelliteOk && filterInitialDateOk && filterFinalDateOk &&
                                filterProcessingScriptOk && filterPreProcessingScriptOk) {
                                selectedRegion.processedImages.push(image);
                            }
                        } else {
                            if (filterSatelliteOk || filterInitialDateOk || filterFinalDateOk ||
                                filterProcessingScriptOk || filterPreProcessingScriptOk) {
                                selectedRegion.processedImages.push(image);
                            }
                        }

                    })
                }

            }

            if (isAnd) {
                if (filterNameOk && filterTagsOk && filterRegionOk) {
                    matches = true;
                }
            } else {
                if (filterNameOk || filterTagsOk || filterRegionOk) {
                    matches = true;
                }
            }
            console.log("Trying Push " + JSON.stringify(selectedRegion))
            if (matches && selectedRegion.processedImages.length > 0) {
                console.log("Pushing " + selectedRegion)
                $scope.searchedRegions.push(selectedRegion)
            }

        });
        //Adding interface controllers
        $scope.searchedRegions.forEach(function(region, index) {
            console.log("Verifing Detail: " + JSON.stringify(region))
            region.checked = false;
            region.allImgChecked = false;
            region.processedImages.forEach(function(img, i) {
                img.checked = false;
            });
        });
    }

    $scope.cleanSearch = function() {

        $scope.allDetailsChecked = false;
        $scope.regionsDetails = [];
        selectedRegion = undefined;
        searchedRegions = [];

        $('#search-first-year-input').val('');
        $('#search-last-year-input').val('');

        $scope.searchFilters.generalSearch = '';
        $scope.searchFilters.regionFilter = '';
        $scope.searchFilters.sapsVersionOptFilter = $scope.DEFAULT_VALUE;
        $scope.searchFilters.sapsVersionFilter = '';
        $scope.searchFilters.sapsTagOptFilter = $scope.DEFAULT_VALUE;
        $scope.searchFilters.sapsTagFilter = '';
        $scope.searchFilters.satellite = '';

        $('#rad-filter-defaul-ver').prop("checked", 'checked');
        $('#rad-filter-other-ver').prop("checked", null);
        $('#rad-filter-defaul-tag').prop("checked", 'checked');
        $('#rad-filter-other-tag').prop("checked", null);

        $scope.satelliteOpts.forEach(function(item, index) {
            $('#radio-satellite-' + (index + 1)).prop("checked", null);
        });

    }

    $scope.sendEmail = function() {

        var imgLinks = [];
        $scope.regionsDetails.forEach(function(regionDetail, index) {
            if (regionDetail.checked) {
                regionDetail.images.forEach(function(img, i) {
                    console.log("Img: " + JSON.stringify(img))
                    if (img.checked) {
                        var newImgLinks = {
                            imgName: img.name,
                            links: []
                        }
                        img.satellites.forEach(function(sat, ind) {
                            if (sat.link != undefined) {
                                newImgLinks.links.push(sat.link);
                            }
                        });
                        if (newImgLinks.links.length > 0) {
                            imgLinks.push(newImgLinks);
                        }
                    }
                })
            }
        });

        var email = {
            email: AuthenticationService.getUserName(),
            links: imgLinks
        }
        console.log("Sending " + JSON.stringify(email));

        EmailService.sendEmail(email,
            function(data) {
                console.log("Return: " + JSON.stringify(data))
                GlobalMsgService.globalSuccessModalMsg($rootScope.languageContent.messages.sendEmailSuccess)
            },
            function(error) {
                console.log("Error: " + JSON.stringify(error))
            })
    }

    $scope.handleCheckUncheckAllDetails = function() {

        $scope.allDetailsChecked = !$scope.allDetailsChecked
        console.log("Handling for " + $scope.allDetailsChecked)
        $scope.checkUncheckAllDetails($scope.allDetailsChecked);
        $scope.linksSelected = hasAnyImageChecked();
    }
    $scope.checkUncheckAllDetails = function(check) {
        $scope.regionsDetails.forEach(function(regionDetail, index) {
            regionDetail.checked = check;
            $scope.checkUncheckAllImages(regionDetail, check);
        });
    }
    $scope.checkUncheckRegionDetail = function(regionDetail) {
        var allChecked = true;
        console.log("Check Uncheck for " + JSON.stringify(regionDetail))
        $scope.checkUncheckAllImages(regionDetail, !regionDetail.checked);
        $scope.regionsDetails.forEach(function(rd, index) {
            if (!rd.checked) {
                allChecked = false;
            }
        });
        $scope.allDetailsChecked = allChecked;
        $scope.linksSelected = hasAnyImageChecked();
    }
    $scope.handleCheckUncheckAllImages = function(regionName) {
        var check;
        for (var index = 0; index < $scope.regionsDetails.length; index++) {
            if ($scope.regionsDetails[index].name == regionName) {
                check = !$scope.regionsDetails[index].allImgChecked;
                $scope.checkUncheckAllImages($scope.regionsDetails[index], check);
                break;
            }
        }
        $scope.linksSelected = hasAnyImageChecked();
    }
    $scope.checkUncheckAllImages = function(regionDetail, check) {

        regionDetail.allImgChecked = check;

        regionDetail.images.forEach(function(img, i) {
            img.checked = check;
        })

        console.log("Check Uncheck all images for " + JSON.stringify(regionDetail))
    }
    $scope.checkUncheckImage = function(regionName) {
        console.log("checkUncheckImage")
        for (var index = 0; index < $scope.regionsDetails.length; index++) {
            if ($scope.regionsDetails[index].name == regionName) {
                var allChecked = true;
                $scope.regionsDetails[index].images.forEach(function(img, i) {
                    console.log("Img Checked? " + img.checked)
                    if (!img.checked) {
                        allChecked = false;
                    }
                })
                $scope.regionsDetails[index].allImgChecked = allChecked;
                break;
            }
        }
        $scope.linksSelected = hasAnyImageChecked();
    }

    function hasAnyImageChecked() {
        if ($scope.allDetailsChecked) {
            return true;
        }
        for (var index = 0; index < $scope.regionsDetails.length; index++) {
            if ($scope.regionsDetails[index].checked) {
                return true;
            }
            if ($scope.regionsDetails[index].allImgChecked) {
                return true;
            }
            $scope.regionsDetails[index].images.forEach(function(img, i) {
                console.log("Img Checked? " + img.checked);
                if (img.checked) {
                    return true;
                }
            })
        }
        return false;
    }

    $scope.zoomIn = function() {
        sapsMap.zoomIn();
    }
    $scope.zoomOut = function() {
        sapsMap.zoomOut();
    }
});