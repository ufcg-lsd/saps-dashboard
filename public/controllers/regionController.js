var dashboardControllers = angular.module('dashboardControllers');

dashboardControllers.controller(
    'RegionController',
    function(
        $scope, $rootScope, $log, $filter, $http, $timeout,
        AuthenticationService, RegionService, EmailService, GlobalMsgService,
        NgTableParams, appConfig) {
      // Script options
      $scope.inputGatheringOptions = appConfig.scriptsTags.inputdownloading;
      $scope.inputPreprocessingOptions = appConfig.scriptsTags.preprocessing;
      $scope.algorithmExecutionOptions = appConfig.scriptsTags.processing;

      // Filters for region search
      $scope.searchFilters = undefined;

      // Filters for region search
      $scope.searchedRegions = [];

      $scope.tableSearchedRegions = undefined;

      //-------- BEGIN- Methods for action on MAP --------//

      // Initializing saps map
      var sapsMap = initiateMap(
          'map', $rootScope.heatMap.colours, $rootScope.heatMap.transparency);

      // Handle for action of selecting an specific region on map
      function selectRegionOnMap(UR, LL) {
        if (UR === undefined || LL === undefined) {
          $scope.$apply(function() {
            if (!$('#sb-map-feature-options').hasClass('sb-hidden')) {
              $('#sb-map-feature-options').addClass('sb-hidden');
            }
          });
        } else {
          $scope.$apply(function() {
            if ($('#sb-map-feature-options').hasClass('sb-hidden')) {
              $('#sb-map-feature-options').removeClass('sb-hidden');
            }
            $scope.cleanSearch();
            $scope.searchFilters.lowerLeftCoord.lat = LL[1];
            $scope.searchFilters.lowerLeftCoord.long = LL[0];
            $scope.searchFilters.upperRightCoord.lat = UR[1];
            $scope.searchFilters.upperRightCoord.long = UR[0];
          });
        }
      };

      function callbackBoxSelectionInfo(selectionInfo) {
        $scope.message = 'Selection: ' + JSON.stringify(selectionInfo);
        $scope.$apply();  // This is for apply the modification avbove, that is
                          // made by callback.
        if (selectionInfo.quaresSelected > 4) {
          alert(
              'Invalid selection!! You can\'t select more than 4 regions on the grid.');
        } else {
          alert('Selection at :' + JSON.stringify(selectionInfo));
        }
      };

      // sapsMap.on('mapMove',updateVisibleRegions)
      sapsMap.on('regionSelect', selectRegionOnMap)
      sapsMap.on('regionBoxSelect', callbackBoxSelectionInfo)

      //-------- END- Methods for action on MAP --------//

      function setProcessedCount(regions, imagesProcessedByRegion) {
        regions.forEach(function(region) {
          var count = imagesProcessedByRegion.get(region.properties.regionName);
          if (count !== undefined) {
            region.properties.processedImages = count;
          }
        });
      }

      function processedImagesToMap(images) {
        var res = new Map();
        images.forEach(function(processed) {
          res.set(processed.region, parseInt(processed.count))
        });
        return res;
      }

      function loadRegions() {
        RegionService.getRegions(
            function(featureCollection) {
              var succeededCallback =
                  function(response) {
                var processedImagesMap = processedImagesToMap(response.data);
                setProcessedCount(
                    featureCollection.features, processedImagesMap);
                sapsMap.generateGrid(featureCollection);
              } var failedCallback =
                      function(error) {
                console.log(
                    'Failed to load region details ' + JSON.stringify(error));
              } RegionService
                          .getRegionsDetails(succeededCallback, failedCallback);
            },
            function(error) {
              if (error.status != 200 && error.status != 0) {
                console.log('Error while trying to get regions: ');
                console.log(error);
              }
            });
      }

      function processRegionHeatmap(region) {
        var transparency = $rootScope.heatMap.transparency;

        for (var index = 0; index < $rootScope.heatMap.colours.length;
             index++) {
          var item = $rootScope.heatMap.colours[index];

          if ((item.minValue == undefined &&
               region.regionDetail.processedImages <= item.maxValue) ||
              (item.maxValue == undefined &&
               region.regionDetail.processedImages >= item.minValue) ||
              (region.regionDetail.processedImages >= item.minValue &&
               region.regionDetail.processedImages <= item.maxValue)) {
            region.regionDetail.color = [item.r, item.g, item.b, transparency];
            region.regionDetail.cssColor =
                'rgb(' + item.r + ',' + item.g + ',' + item.b + ')';
            break;
          }
        };
      }
      loadRegions();

      $scope.submitSearch = function() {
        var data = {};

        if ($scope.searchFilters.lowerLeftCoord.lat === undefined ||
            $scope.searchFilters.lowerLeftCoord.long === undefined ||
            $scope.searchFilters.upperRightCoord.lat === undefined ||
            $scope.searchFilters.upperRightCoord.long === undefined) {
          GlobalMsgService.globalSuccessModalMsg(
              $rootScope.languageContent.messages.failCoordinatesRequired);
          return;
        } else {
          if (isNaN($scope.searchFilters.lowerLeftCoord.lat) ||
              isNaN($scope.searchFilters.lowerLeftCoord.long) ||
              isNaN($scope.searchFilters.upperRightCoord.lat) ||
              isNaN($scope.searchFilters.upperRightCoord.long)) {
            GlobalMsgService.globalSuccessModalMsg(
                $rootScope.languageContent.messages.failCoordinatesNotNumber);
            return;
          }
          data.lowerLeft = [
            parseFloat($scope.searchFilters.lowerLeftCoord.lat) + 0.5,
            parseFloat($scope.searchFilters.lowerLeftCoord.long) + 0.5
          ];
          data.upperRight = [
            parseFloat($scope.searchFilters.upperRightCoord.lat) - 0.5,
            parseFloat($scope.searchFilters.upperRightCoord.long) - 0.5
          ];
        }
        if ($scope.searchFilters.initialDate === undefined) {
          GlobalMsgService.globalSuccessModalMsg(
              $rootScope.languageContent.messages.failInitialDateRequired);
          return;
        } else {
          data.initialDate =
              $scope.searchFilters.initialDate.toISOString().slice(0, 11);
        }
        if ($scope.searchFilters.finalDate === undefined) {
          GlobalMsgService.globalSuccessModalMsg(
              $rootScope.languageContent.messages.failFinalDateRequired);
          return;
        } else {
          data.finalDate =
              $scope.searchFilters.finalDate.toISOString().slice(0, 11);
        }
        if ($scope.searchFilters.initialDate > $scope.searchFilters.finalDate) {
          GlobalMsgService.globalSuccessModalMsg(
              $rootScope.languageContent.messages.failDateInvalid);
          return;
        }
        data.inputPreprocessingTag =
            $scope.searchFilters.inputPreprocessing.name;
        data.inputGatheringTag = $scope.searchFilters.inputGathering.name;
        data.algorithmExecutionTag =
            $scope.searchFilters.algorithmExecution.name;

        $rootScope.switchVisibility('sb-map-feature-options');
        $rootScope.loadingModalMessage =
            $rootScope.languageContent.mapFeature.searchBox.label.loadSearch;
        $scope.openCloseModal('loadingModal', true);

        RegionService.postSearch(
            data,
            function(response) {
              $scope.openCloseModal('loadingModal', false);
              $scope.searchedRegions = response.data.result;
              if ($scope.searchedRegions.length == 0) {
                // TODO move message to language content
                GlobalMsgService.globalSuccessModalMsg(
                    $rootScope.languageContent.messages.noResultSearch);
                return;
              }
              $scope.searchedRegions.forEach(function(data) {
                data.checked = false;
              });
              $scope.tableSearchedRegions = new NgTableParams(
                  {group: 'region'}, {dataset: $scope.searchedRegions});
            },
            function(error) {
              $log.error(JSON.stringify(error));
              $scope.openCloseModal('loadingModal', false);
              if (error.code == 401) {
                GlobalMsgService.globalSuccessModalMsg(
                    $rootScope.languageContent.messages
                        .unauthorizedNewSubmission);
              } else {
                // TODO move message to language content
                GlobalMsgService.globalSuccessModalMsg(
                    'Could not submit search.');
              }
            });
      };

      $scope.cleanSearch = function() {
        $scope.searchFilters = {
          lowerLeftCoord: {lat: undefined, long: undefined},
          upperRightCoord: {lat: undefined, long: undefined},
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
          res = $scope.searchedRegions.every(function(data) {
            if (data.region != region) {
              return true;
            } else {
              return data.checked === true;
            }
          });
        } else {
          res = $scope.searchedRegions.every(function(data) {
            return data.checked === true;
          });
        }
        return res;
      };

      $scope.someChecked = function() {
        var res = false;
        if (arguments.length > 0) {
          var region = arguments[0];
          res = $scope.searchedRegions.some(function(data) {
            if (data.region != region) {
              return true;
            } else {
              return data.checked === true;
            }
          });
          res = res && !$scope.allChecked(region);
        } else {
          res = $scope.searchedRegions.some(function(data) {
            return data.checked === true;
          });
          res = res && !$scope.allChecked();
        }
        return res;
      };

      $scope.toggleChecked =
          function() {
        var region = undefined;
        if (arguments.length > 0) {
          region = arguments[0];
        }
        if (region === undefined) {
          if ($scope.allChecked()) {
            $scope.searchedRegions.forEach(function(data) {
              data.checked = false;
            })
          } else {
            $scope.searchedRegions.forEach(function(data) {
              data.checked = true;
            })
          }
        } else {
          if ($scope.allChecked(region)) {
            $scope.searchedRegions.forEach(function(data) {
              if (data.region == region) {
                data.checked = false;
              }
            })
          } else {
            $scope.searchedRegions.forEach(function(data) {
              if (data.region == region) {
                data.checked = true;
              }
            })
          }
        }
      }

          $scope.sendEmail = function() {
        var request = {images_id: []};
        $scope.searchedRegions.forEach(function(data) {
          if (data.checked === true) {
            request.images_id.push(data.taskId);
          }
        });
        if (request.images_id.length === 0) {
          // TODO move message to language content
          GlobalMsgService.globalSuccessModalMsg(
              'No image selected. Select at least one image.');
          return;
        }
        var suc = function(response) {
          // TODO move message to language content
          GlobalMsgService.globalSuccessModalMsg(
              'Email sent. Should arrive in a few minutes.');
          console.log(response.data);
        } var err = function(error) {
          $log.error(JSON.stringify(error));
          if (error.code == 401) {
            GlobalMsgService.globalSuccessModalMsg(
                $rootScope.languageContent.messages.unauthorizedNewSubmission);
          } else {
            GlobalMsgService.globalSuccessModalMsg(error.data.description);
          }
        } RegionService.sendEmail(request, suc, err);
      }
    });
