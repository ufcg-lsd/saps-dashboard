var dashboardControllers = angular.module('dashboardControllers');

dashboardControllers.controller('ListSubmissionsController', function($scope, $rootScope, $log, $filter, $timeout, $filter,
    SubmissionService, AuthenticationService, GlobalMsgService, EmailService, appConfig, NgTableParams) {

    $scope.ongoingTasks = [];
    $scope.completedTasks = [];

    $scope.listFilter = "";

    $scope.elementShowingDetail = undefined;
    $scope.showEmailInfo = false;

    $scope.allChecked = false;

    $scope.detail = {
        downloadLink: "",
        state: "",
        federationMember: "",
        priority: "",
        stationId: "",
        sebalVersion: "",
        sebalTag: "",
        crawlerVersion: "",
        fetcherVersion: "",
        blowoutVersion: "",
        fmaskVersion: "",
        creationTime: "",
        updateTime: "",
        status: "",
        error: ""
    }

    $scope.satelliteOpts = appConfig.SATELLITE_OPTS;

    // Script options
    $scope.processingScripts = [
        {
            name: 'DEFAULT',
            value: 'default_script'
        }
    ]


    $scope.preProcessingScripts = [
        {
            name: 'DEFAULT',
            value: 'default_pre-script'
        }
    ]
    console.log("procScriptOpts: " + JSON.stringify($scope.processingScripts));
    // Filters
    $scope.searchFilters = {
        name: '',
        tags: '',
        region: '',
        processingScriptName: $scope.processingScripts[0].name,
        processingScriptValue: $scope.processingScripts[0].value,
        preProcessingScriptName: $scope.preProcessingScripts[0].name,
        preProcessingScriptValue: $scope.preProcessingScripts[0].value,
        satellite: ''
    };

    //Interface controls
    $scope.changeProcScript = function(newScriptOpt) {
        $scope.searchFilters.processingScriptName = newScriptOpt.name;
        $scope.searchFilters.processingScriptValue = newScriptOpt.value;
    };


    $scope.changePreProcScript = function(newScriptOpt) {
        $scope.searchFilters.preProcessingScriptName = newScriptOpt.name;
        $scope.searchFilters.preProcessingScriptValue = newScriptOpt.value;
    }

    $scope.filterTable = function(str) {
        var newOngoing = [];
        var newCompleted = [];
        this.ongoingTasks.forEach(function(item) {
            if (item.name.includes(str) ||
                item.imageDate.includes(str) ||
                item.inputGatheringTag.includes(str) ||
                item.inputPreprocessingTag.includes(str) ||
                item.algorithmExecutionTag.includes(str) ||
                item.state.includes(str)
            ) {
                newOngoing.push(item);
            }
        });
        this.completedTasks.forEach(function(item) {
            if (item.name.includes(str) ||
                item.date.includes(str) ||
                item.inputGatheringTag.includes(str) ||
                item.inputPreprocessingTag.includes(str) ||
                item.algorithmExecutionTag.includes(str) ||
                item.state.includes(str)
            ) {
                newCompleted.push(item);
            }
        });
        self.ongoingTasksCount = newOngoing.length;
        self.ongoingTasks = new NgTableParams({count:4}, { dataset: newOngoing, counts: [] });
        self.completedTasksCount = newCompleted.length;
        self.completedTasks = new NgTableParams({count:4}, { dataset: newCompleted, counts: [] });
    }

    $scope.filterSubmissions = function() {
        console.log("Filtros para submissoes " + JSON.stringify($scope.searchFilters))

        var isAnd = true;

        submissions.forEach(function(submission, index) {
            submission.show = false;
            var filterNameOk = false;
            var filterTagsOk = false;
            var filterRegionOk = false;
            var filterSatelliteOk = false;
            var filterInitialDateOk = false;
            var filterFinalDateOk = false;
            var filterProcessingScriptOk = false;
            var filterPreProcessingScriptOk = false;
            //If has name, filtering by name
            if ($rootScope.validateString($scope.searchFilters.name)) {

                var values = $scope.searchFilters.name.split(" ");
                values.forEach(function(str, i) {
                    if (submission.name.toLowerCase().includes(str.toLowerCase())) {
                        console.log("Show submission " + submission.name + " due name filter")
                        filterNameOk = true;
                    }
                })
            } else {
                filterNameOk = true;
            }
            //If has tgas, filtering by tags
            if ($rootScope.validateString($scope.searchFilters.tags)) {
                //TODO - FIx this
                submission.tags.forEach(function(tag, i) {
                    var tagParts = tag.split(" ");
                    tagParts.forEach(function(tagPart, z) {
                        var tagFilterParts = $scope.searchFilters.tags.split(";");
                        tagFilterParts.forEach(function(filterTag, y) {
                            if (tagPart.toLowerCase().includes(filterTag.toLowerCase())) {
                                console.log("Show submission " + submission.name + " due tag filter")
                                filterTagsOk = true;
                            }
                        })

                    })
                });
            } else {
                filterTagsOk = true;
            }
            //If has Region, filtering by region
            if ($rootScope.validateString($scope.searchFilters.region)) {
                var regionValues = $scope.searchFilters.region.split(" ");
                regionValues.forEach(function(str, i) {
                    if (submission.region.toLowerCase().includes(str.toLowerCase())) {
                        console.log("Show submission " + submission.name + " due region filter")
                        filterRegionOk = true;
                    }
                })
            } else {
                filterRegionOk = true;
            }
            //If has satelliti, filtering by satelliti
            if ($rootScope.validateString($scope.searchFilters.satellite)) {

                if ($scope.searchFilters.satellite == 'l4' &&
                    submission.sat4 == true) {
                    console.log("Show submission " + submission.name + " due sat4 filter")
                    filterSatelliteOk = true;
                }
                if ($scope.searchFilters.satellite == 'l5' &&
                    submission.sat5 == true) {
                    console.log("Show submission " + submission.name + " due sat5 filter")
                    filterSatelliteOk = true;
                }
                if ($scope.searchFilters.satellite == 'l7' &&
                    submission.sat7 == true) {
                    console.log("Show submission " + submission.name + " due sat7 filter")
                    filterSatelliteOk = true;
                }
            } else {
                filterSatelliteOk = true;
            }

            //If has processing script, filtering by processing script
            if ($rootScope.validateString($scope.searchFilters.processingScript)) {
                if (submission.processingScript == $scope.searchFilters.processingScript) {
                    console.log("Show submission " + submission.name + " due procScript filter")
                    filterProcessingScriptOk = true;

                }
            } else {
                filterProcessingScriptOk = true;
            }
            //If has pre-processing script, filtering by pre-processing script
            if ($rootScope.validateString($scope.searchFilters.preProcessingScript)) {
                if (submission.preProcessingScript == $scope.searchFilters.preProcessingScript) {
                    console.log("Show submission " + submission.name + " due preProcScript filter")
                    filterPreProcessingScriptOk = true;
                }
            } else {
                filterPreProcessingScriptOk = true;
            }

            var initialDate = undefined;
            var finalDate = undefined;

            if ($rootScope.validateDate($('#filter-initial-date-input').val())) {
                initialDate = $rootScope.parseDate($('#filter-initial-date-input').val())
            }

            if ($rootScope.validateDate($('#filter-final-date-input').val())) {
                finalDate = $rootScope.parseDate($('#filter-final-date-input').val())
            }

            if (initialDate && finalDate) {
                if (submission.date >= initialDate &&
                    submission.date <= finalDate) {
                    console.log("Show submission " + submission.name + " due dates filter")
                    filterInitialDateOk = true;
                    filterFinalDateOk = true;
                }
            } else {
                if (!initialDate) {
                    filterInitialDateOk = true;
                } else if (initialDate && submission.date == initialDate) {
                    console.log("Show submission " + submission.name + " due initialDate filter")
                    filterInitialDateOk = true;
                }
                if (!finalDate) {
                    filterFinalDateOk = true;
                } else if (finalDate && submission.date == finalDate) {
                    console.log("Show submission " + submission.name + " due finalDate filter")
                    filterFinalDateOk = true;
                }
            }

            if (isAnd) {
                if (filterNameOk && filterTagsOk && filterRegionOk &&
                    filterSatelliteOk && filterInitialDateOk && filterFinalDateOk &&
                    filterProcessingScriptOk && filterPreProcessingScriptOk) {
                    submission.show = true;
                }
            } else {
                if (filterNameOk || filterTagsOk || filterRegionOk ||
                    filterSatelliteOk || filterInitialDateOk || filterFinalDateOk ||
                    filterProcessingScriptOk || filterPreProcessingScriptOk) {
                    submission.show = true;
                }
            }

        })
    }

    var self = this;

    function isCompleted(processing) {
        return 'state' in processing &&
            (processing.state === 'fetched' || processing.state === 'error');
    }

    function isOngoing(processing) {
        return !isCompleted(processing);
    }

    var updateProcessingsByState = function(tasks) {
        $scope.ongoingTasks.splice(0, $scope.ongoingTasks.length);
        $scope.completedTasks.splice(0, $scope.completedTasks.length)

        tasks.forEach(function(currentProcessing, index) {
            if (isOngoing(currentProcessing)) {
                $scope.ongoingTasks.push(currentProcessing)
            } else if (isCompleted(currentProcessing)) {
                $scope.completedTasks.push(currentProcessing)
            }
        });
        self.ongoingTasksCount = $scope.ongoingTasks.length;
        self.ongoingTasks = new NgTableParams({count:4}, { dataset: $scope.ongoingTasks, counts: [] });
        self.completedTasksCount = $scope.completedTasks.length;
        self.completedTasks = new NgTableParams({count:4}, { dataset: $scope.completedTasks, counts: [] });
    }

    $scope.generateTagsComponent = function(submission) {

        if (submission.tagListComponent == undefined) {
            console.log('Gerando tags para: ' + submission.id)
            //Creating tag component
            var jnlitemListConfg = {
                target: submission.id + '-tags-div',
                items: submission.tags,
                options: {
                    editButton: undefined,
                    permanentInput: false,
                },
            }

            var tagList = lnil.NLItemsList(jnlitemListConfg);
            submission.tagListComponent = tagList;
            submission.tagListComponent.on('listchange', function(newList) {
                $scope.$apply(function() {
                    submission.tags = submission.tagListComponent.getValues();
                })
            });

        }

    }

    $scope.setChecked = function(value, tasks) {
        for (var i = 0; i < tasks.length; i++) {
            tasks[i].checked = value;
        }
    }

    $scope.getSapsSubmissions = function() {
        SubmissionService.getSubmissions(
            function(data) {
                updateProcessingsByState(data)
            },
            function(error) {
                var msg = "An error occurred when tried to get Images";
                GlobalMsgService.pushMessageFail(msg)
            }
        );
    }

    $scope.sendEmail = function() {
        var imgLinks = [];
        $scope.tasksByState.forEach(function(submission, index) {
            if (submission.checked) {
                submission.images.forEach(function(img, i) {
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

    $scope.getSapsSubmissions();
});

dashboardControllers.controller('NewSubmissionsController', function($scope, $rootScope, $log, $filter,
    $timeout, AuthenticationService, SubmissionService, GlobalMsgService, appConfig) {

    $scope.modalMsgError = undefined;
    // $scope.satelliteOpts = appConfig.SATELLITE_OPTS;

    $scope.newSubmission = {
        lowerLeftCoord: {
            lat: -8.676947,
            long: -37.095067
            // lat: 0.0,
            // long: 0.0
        },
        upperRightCoord: {
            lat: -8.676947,
            long: -37.095067
            // lat: 0.0,
            // long: 0.0
        },
        initialDate: undefined,
        finalDate: undefined,
        inputGathering: undefined,
        inputPreprocessing: undefined,
        algorithimExecution: undefined
    }

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

    $scope.algorithimExecutionOptions = [
        {
            name: 'Default',
            value: 'default_algorithim'
        }
    ];

    $scope.selectedInputGatheringName = $scope.inputGatheringOptions[0].name;
    $scope.selectedInputGatheringValue = $scope.inputGatheringOptions[0].value;
    $scope.selectedInputPreprocessingName = $scope.inputPreprocessingOptions[0].name;
    $scope.selectedInputPreprocessingValue = $scope.inputPreprocessingOptions[0].value;
    $scope.selectedAlgorithimExecutionName = $scope.algorithimExecutionOptions[0].name;
    $scope.selectedAlgorithimExecutionValue = $scope.algorithimExecutionOptions[0].value;

    $scope.$on(appConfig.MODAL_OPENED, function(event, value) {
        $scope.cleanForm();
    });
    $scope.$on(appConfig.MODAL_CLOSED, function(event, value) {
        $scope.cleanForm();
    });

    function msgRequiredShowHide(fieldId, show) {

        requiredMsg = $('#' + fieldId).find('.sb-required')

        if (requiredMsg) {
            if (show) {
                requiredMsg.removeClass('sb-hidden');
            } else {
                requiredMsg.addClass('sb-hidden');
            }
        }

    }

    //Managing datepickers
    $(function() {
        $('.saps-datepicker').datetimepicker({
            format: 'DD/MM/YYYY'
        });
    });

    //Interface controls
    $scope.changeInputGathering = function(newGatheringOpt) {
        $scope.selectedInputGatheringName = newGatheringOpt.name;
        $scope.selectedInputGatheringValue = newGatheringOpt.value;
    };

    $scope.changeInputPreprocessing = function(newPreprocessingOpt) {
        $scope.selectedInputPreprocessingName = newPreprocessingOpt.name;
        $scope.selectedInputPreprocessingValue = newPreprocessingOpt.value;
    }

    $scope.changeAlgorithimExecution = function(newAlgorithimOpt) {
        $scope.selectedAlgorithimExecutionName = newAlgorithimOpt.name;
        $scope.selectedAlgorithimExecutionValue = newAlgorithimOpt.value;
    }

    $scope.cleanForm = function() {

        $scope.submissionName = undefined;
        $('#firstYear').val('');
        $('#lastYear').val('');

        $scope.selectedInputGatheringName = $scope.inputGatheringOptions[0].name;
        $scope.selectedInputGatheringValue = $scope.inputGatheringOptions[0].value;
        $scope.selectedInputPreprocessingName = $scope.inputPreprocessingOptions[0].name;
        $scope.selectedInputPreprocessingValue = $scope.inputPreprocessingOptions[0].value;
        $scope.selectedAlgorithimExecutionName = $scope.algorithimExecutionOptions[0].name;
        $scope.selectedAlgorithimExecutionValue = $scope.algorithimExecutionOptions[0].value;

        //Clean error msgs
        $scope.modalMsgError = undefined;
        msgRequiredShowHide('firstYearField', false);
        msgRequiredShowHide('lastYearField', false);

    }


    $scope.processNewSubmission = function() {
        hasError = false;
        $scope.modalMsgError = undefined;

        if (!$rootScope.validateDate($('#subformFirstYear').val())) {
            hasError = true
            msgRequiredShowHide('firstYearField', true);
        } else {
            $scope.newSubmission.initialDate = $rootScope.parseDate($('#subformFirstYear').val())
            msgRequiredShowHide('firstYearField', false);
        }

        if (!$rootScope.validateDate($('#subformLastYear').val())) {
            hasError = true
            msgRequiredShowHide('lastYearField', true);
        } else {
            $scope.newSubmission.finalDate = $rootScope.parseDate($('#subformLastYear').val())
            msgRequiredShowHide('lastYearField', false);
        }

        if ($scope.newSubmission.initialDate > $scope.newSubmission.finalDate) {
            console.log("Last year date must be greater than first year date")
            $scope.modalMsgError = "Last year date must be greater than first year date";
            hasError = true
        }

        if (hasError) {
            return
        }

        var data = {
            'region': $scope.newSubmission.region,
            'initialDate': $scope.newSubmission.initialDate.toISOString().slice(0,11),
            'finalDate': $scope.newSubmission.finalDate.toISOString().slice(0,11),
            'inputGatheringTag': "Default",
            'inputPreprocessingTag': "Default",
            'algorithmExecutionTag': "Default",
            'lowerLeft': [$scope.newSubmission.lowerLeftCoord.lat, $scope.newSubmission.lowerLeftCoord.long],
            'upperRight': [$scope.newSubmission.upperRightCoord.lat, $scope.newSubmission.upperRightCoord.long]
        };

        console.log("Sending " + JSON.stringify(data));

        SubmissionService.postSubmission(data,
            function(response) {
                // GlobalMsgService.pushMessageSuccess('Your job was submitted. Wait for the processing be completed. ' 
                //       + 'If you activated the notifications you will get an email when finished.');

                $scope.openCloseModal('submissionsModal', false);

                GlobalMsgService.globalSuccessModalMsg($rootScope.languageContent.messages.successNewSubmission);
            },
            function(error) {
                $log.error(JSON.stringify(error));

                $scope.openCloseModal('submissionsModal', false);
                if (error.code == 401) {
                    GlobalMsgService.globalSuccessModalMsg($rootScope.languageContent.messages.unauthorizedNewSubmission);
                } else {
                    GlobalMsgService.globalSuccessModalMsg($rootScope.languageContent.messages.failedNewSubmission);
                }
                //$scope.cleanForm();

            });
    };

});