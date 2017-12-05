var dashboardControllers = angular.module('dashboardControllers');

dashboardControllers.controller('RegionController', function($scope, $rootScope,
    $log, $filter, $http, $timeout, AuthenticationService, RegionService, EmailService,
    GlobalMsgService, NgTableParams, appConfig) {

    var north_offset = 15;
    var east_offset = 45
    var max_north = 4;
    var max_east = 6;
    var cur_grid = [1, 2];

    $scope.moveEast = function() {
        if (cur_grid[1] == max_east) {
            cur_grid[1] = 0;
        } else {
            cur_grid[1] = cur_grid[1] + 1;
        }
        loadRegions();
    };
    $scope.moveWest = function() {
        if (cur_grid[1] == 0) {
            cur_grid[1] = max_east;
        } else {
            cur_grid[1] = cur_grid[1] - 1;
        }
        loadRegions();
    };
    $scope.moveNorth = function() {
        if (cur_grid[0] != max_north) {
            cur_grid[0] = cur_grid[0] + 1;
            loadRegions();
        }
    };
    $scope.moveSouth = function() {
        if (cur_grid[0] != 0) {
            cur_grid[0] = cur_grid[0] - 1;
            loadRegions();
        }
    };

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

    $scope.tableSearchedRegions = undefined;

    //-------- BEGIN- Methods for action on MAP --------//

    //Initializing saps map
    var sapsMap = initiateMap("map");

    //Handle for action of selecting an specific region on map
    function selectRegionOnMap(regionLngLat) {
        if (regionLngLat === undefined) {
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
                $scope.searchFilters.lowerLeftCoord.lat = regionLngLat[3][1];
                $scope.searchFilters.lowerLeftCoord.long = regionLngLat[3][0];
                $scope.searchFilters.upperRightCoord.lat = regionLngLat[1][1];
                $scope.searchFilters.upperRightCoord.long = regionLngLat[1][0];
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
            var regionName = processingsCount.region;

            regions.forEach(function(region) {
                if (regionName === region.regionName) {
                    region.regionDetail.processedImages = count;
                }
            });
        });
    }

    function loadRegions() {
        RegionService.getRegions(
            cur_grid[0],
            cur_grid[1],
            function(regions) {
                var succeededCallback = function(response) {
                    sapsMap.removeLayer("gridLayer");
                    var imagesProcessedByRegion = response.data;
                    setProcessedCount(regions, imagesProcessedByRegion);
                    sapsMap.generateGrid(regions);
                    regions.forEach(function(region, index) {
                        if (region.regionDetail) {
                            processRegionHeatmap(region);
                            sapsMap.updateRegionMapColor(region.regionDetail);
                        }
                    });
                    loadedregions = regions;
                    sapsMap.recenterMap(cur_grid[0], cur_grid[1], north_offset, east_offset);
                }
                var failedCallback = function(error) {
                    console.log("Failed to load region details " + JSON.stringify(error));
                }
                RegionService.getRegionsDetails(succeededCallback, failedCallback);
            },
            function(error) {
                if (error.status != 200 && error.status != 0) {
                    console.log('Error while trying to get regions: ');
                    console.log(error);
                }
            }
        );
    }

    function processRegionHeatmap(region) {
        var transparency = $rootScope.heatMap.transparency;

        for (var index = 0; index < $rootScope.heatMap.colours.length; index++) {

            var item = $rootScope.heatMap.colours[index];

            if ((item.minValue == undefined && region.regionDetail.processedImages <= item.maxValue) ||
                (item.maxValue == undefined && region.regionDetail.processedImages >= item.minValue) ||
                (region.regionDetail.processedImages >= item.minValue && region.regionDetail.processedImages <= item.maxValue)) {

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
            data.lowerLeft = [parseFloat($scope.searchFilters.lowerLeftCoord.lat)+0.5, parseFloat($scope.searchFilters.lowerLeftCoord.long)+0.5];
            data.upperRight = [parseFloat($scope.searchFilters.upperRightCoord.lat)-0.5, parseFloat($scope.searchFilters.upperRightCoord.long)-0.5];
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
        $rootScope.loadingModalMessage = $rootScope.languageContent.mapFeature.searchBox.label.loadSearch;
        $scope.openCloseModal('loadingModal', true);
        
        RegionService.postSearch(data,
            function(response) {
                $scope.openCloseModal('loadingModal', false);
                $scope.searchedRegions = response.data.result;
                if ($scope.searchedRegions.length == 0) {
                    // TODO move message to language content
                    GlobalMsgService.globalSuccessModalMsg("There were no results for this search.");
                    return;
                }
                $scope.searchedRegions.forEach(
                    function(data) {
                        data.checked = false;
                    }
                );
                $scope.tableSearchedRegions = new NgTableParams(
                    {
                        group: "region"
                    }, {
                        dataset: $scope.searchedRegions
                    }
                );
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

    $scope.allChecked = function() {
        var res = false;
        if (arguments.length > 0) {
            var region = arguments[0];
            res = $scope.searchedRegions.every(
                function(data) {
                    if (data.region != region) {
                        return true;
                    } else {
                        return data.checked === true;
                    }
                }
            );
        } else {
            res = $scope.searchedRegions.every(
                function(data) {
                    return data.checked === true;
                }
            );
        }
        return res;
    };

    $scope.someChecked = function() {
        var res = false;
        if (arguments.length > 0) {
            var region = arguments[0];
            res = $scope.searchedRegions.some(
                function(data) {
                    if (data.region != region) {
                        return true;
                    } else {
                        return data.checked === true;
                    }
                }
            );
            res = res && !$scope.allChecked(region);
        } else {
            res = $scope.searchedRegions.some(
                function(data) {
                    return data.checked === true;
                }
            );
            res = res && !$scope.allChecked();
        }
        return res;
    };

    $scope.toggleChecked = function() {
        var region = undefined;
        if (arguments.length > 0) {
            region = arguments[0];
        }
        if (region === undefined) {
            if ($scope.allChecked()) {
                $scope.searchedRegions.forEach(
                    function(data) {
                        data.checked = false;
                    }
                )
            } else {
                $scope.searchedRegions.forEach(
                    function(data) {
                        data.checked = true;
                    }
                )
            }
        } else {
            if ($scope.allChecked(region)) {
                $scope.searchedRegions.forEach(
                    function(data) {
                        if (data.region == region) {
                            data.checked = false;
                        }
                    }
                )
            } else {
                $scope.searchedRegions.forEach(
                    function(data) {
                        if (data.region == region) {
                            data.checked = true;
                        }
                    }
                )
            }
        }
    }

    $scope.sendEmail = function() {
        var request = {
            images_id: []
        };
        $scope.searchedRegions.forEach(
            function(data) {
                if (data.checked === true) {
                    request.images_id.push(data.taskId);
                }
            }
        );
        if (request.images_id.length === 0) {
            GlobalMsgService.globalSuccessModalMsg("No image selected. Select at least one image.");
            return;
        }
        var suc = function(response) {
            // TODO move message to language content
            GlobalMsgService.globalSuccessModalMsg("Email sent. Should arrive in a few minutes.");
            console.log(response.data);
        }
        var err = function(error) {
            $log.error(JSON.stringify(error));
            if (error.code == 401) {
                GlobalMsgService.globalSuccessModalMsg($rootScope.languageContent.messages.unauthorizedNewSubmission);
            } else {
                GlobalMsgService.globalSuccessModalMsg(error.data.description);
            }
        }
        RegionService.sendEmail(request, suc, err);
    }

});