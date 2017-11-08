var dashboardControllers = angular.module('dashboardControllers');

dashboardControllers.controller('RegionController', function($scope, $rootScope,
    $log, $filter, $http, $timeout, AuthenticationService, RegionService, EmailService,
    GlobalMsgService, appConfig) {

    // Script options
    $scope.inputGatheringOptions = [
        {
            name: 'Default',
            value: 'default_script'
        }
    ];
    $scope.inputPreprocessingOptions = [
        {
            name: 'Default',
            value: 'default_pre-script'
        }
    ];
    $scope.algorithmExecutionOptions = [
        {
            name: 'Default',
            value: 'default_algorithim'
        }
    ];
    
    // Filters for region search
    $scope.searchFilters = undefined;
        
    // Filters for region search
    $scope.searchedRegions = [];

    //-------- BEGIN- Methods for action on MAP --------//

    //Initializing saps map
    var sapsMap = initiateMap("map");

    //Handle for action of selecting an specific region on map
    function selectRegionOnMap(regionLatLon) {
        if (regionLatLon === undefined) {
            $scope.$apply(function() {
                if (! $('#sb-map-feature-options').hasClass("sb-hidden")) {
                    $('#sb-map-feature-options').addClass("sb-hidden");
                }
            });
        } else {
            $scope.$apply(function() {
                if ($('#sb-map-feature-options').hasClass("sb-hidden")) {
                    $('#sb-map-feature-options').removeClass("sb-hidden");
                }
                $scope.cleanSearch();
                $scope.searchFilters.lowerLeftCoord.lat = regionLatLon[3][1];
                $scope.searchFilters.lowerLeftCoord.long = regionLatLon[3][0];
                $scope.searchFilters.upperRightCoord.lat = regionLatLon[1][1];
                $scope.searchFilters.upperRightCoord.long = regionLatLon[1][0];
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

    //sapsMap.on('mapMove',updateVisibleRegions)
    sapsMap.on('regionSelect', selectRegionOnMap)
    sapsMap.on('regionBoxSelect', callbackBoxSelectionInfo)

    //-------- END- Methods for action on MAP --------//

    function setProcessedCount(regions, imagesProcessedByRegion) {
        imagesProcessedByRegion.forEach(function(processingsCount, index) {
            var count = parseInt(processingsCount.count);
            var path = parseInt(processingsCount.region.slice(0, 3));
            var row = parseInt(processingsCount.region.slice(3));
            var regionName = path + "_" + row;

            regions.forEach(function(region, index) {
                if (regionName === region.regionName) {
                    region.regionDetail.processedImages.length = count;
                }
            });
        });
    }

    function loadRegions() {
        RegionService.getRegions(
            function(regions) {
                var succeededCallback = function(response1) {
                    var imagesProcessedByRegion = response1.data;
                    setProcessedCount(regions, imagesProcessedByRegion);
                    sapsMap.generateGrid(regions);
                    regions.forEach(function(region, index) {
                        if (region.regionDetail && region.regionDetail.processedImages) {
                            processRegionHeatmap(region);
                            sapsMap.updateRegionMapColor(region.regionDetail);
                        }
                    });
                    loadedregions = regions;
                }
                var failedCallback = function(error) {
                    console.log(error);
                }
                RegionService.getRegionsDetails(succeededCallback, failedCallback);
            },
            function(error) {
                if (error.status != 200 && error.status != 0) {
                    console.log('Error while trying to ge regions: ');
                    console.log(error);
                }
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

    $scope.submitSearch = function() {
        var data = {};

        if (
            $scope.searchFilters.lowerLeftCoord.lat === undefined ||
            $scope.searchFilters.lowerLeftCoord.long === undefined ||
            $scope.searchFilters.upperRightCoord.lat === undefined ||
            $scope.searchFilters.upperRightCoord.long === undefined
            ) {
            // TODO move message to language content
            GlobalMsgService.globalSuccessModalMsg("Coordinates are required");
            return;
        } else {
            if (
                isNaN($scope.searchFilters.lowerLeftCoord.lat) ||
                isNaN($scope.searchFilters.lowerLeftCoord.long) ||
                isNaN($scope.searchFilters.upperRightCoord.lat) ||
                isNaN($scope.searchFilters.upperRightCoord.long)
            ) {
                // TODO move message to language content
                GlobalMsgService.globalSuccessModalMsg("Coordinates are not numbers");
                return;
            }
            data.lowerLeft = [parseFloat($scope.searchFilters.lowerLeftCoord.lat), parseFloat($scope.searchFilters.lowerLeftCoord.long)];
            data.upperRight = [parseFloat($scope.searchFilters.upperRightCoord.lat), parseFloat($scope.searchFilters.upperRightCoord.long)];
        }
        if ($scope.searchFilters.initialDate === undefined) {
            // TODO move message to language content
            GlobalMsgService.globalSuccessModalMsg("Initial date is required");
            return;
        } else {
            data.initialDate = $scope.searchFilters.initialDate.toISOString().slice(0,11);
        }
        if ($scope.searchFilters.finalDate === undefined) {
            // TODO move message to language content
            GlobalMsgService.globalSuccessModalMsg("Final date is required");
            return;
        } else {
            data.finalDate = $scope.searchFilters.finalDate.toISOString().slice(0,11);
        }
        if ($scope.searchFilters.initialDate > $scope.searchFilters.finalDate) {
            // TODO move message to language content
            GlobalMsgService.globalSuccessModalMsg("Last year date must be greater than first year date");
            return;
        }
        data.inputPreprocessingTag = $scope.searchFilters.inputGathering.name;
        data.inputGatheringTag = $scope.searchFilters.inputPreprocessing.name;
        data.algorithmExecutionTag = $scope.searchFilters.algorithmExecution.name;
        $rootScope.switchVisibility('sb-map-feature-options');
        $scope.openCloseModal('loadingModal', true);
        RegionService.postSearch(data,
            function(response) {
                $scope.openCloseModal('loadingModal', false);
                $scope.searchedRegions = response.result;
                console.log($scope.searchedRegions);
                // TODO move message to language content
                GlobalMsgService.globalSuccessModalMsg("Results will be sent to your email in a few moments.");
            },
            function(error) {
                $log.error(JSON.stringify(error));
                $scope.openCloseModal('loadingModal', false);
                if (error.code == 401) {
                    GlobalMsgService.globalSuccessModalMsg($rootScope.languageContent.messages.unauthorizedNewSubmission);
                } else {
                    // TODO move message to language content
                    GlobalMsgService.globalSuccessModalMsg("Could not submit search.");
                }
            }
        );
    };

    $scope.cleanSearch = function() {
        console.log("clean search");
        $scope.searchFilters = {
            lowerLeftCoord: {
                lat: undefined,
                long: undefined
            },
            upperRightCoord: {
                lat: undefined,
                long: undefined
            },
            initialDate: undefined,
            finalDate: undefined,
            inputGathering: $scope.inputGatheringOptions[0],
            inputPreprocessing: $scope.inputPreprocessingOptions[0],
            algorithmExecution: $scope.algorithmExecutionOptions[0]
        };
    };

});