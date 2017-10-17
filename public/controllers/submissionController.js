var dashboardControllers = angular.module('dashboardControllers');

dashboardControllers.controller('ListSubmissionsController', function($scope, $rootScope, $log, $filter, $timeout, $filter,
    SubmissionService, AuthenticationService, GlobalMsgService, EmailService, appConfig) {

    $scope.sapsSubmissions = [];
    $scope.allSubmissionsChecked = false;
    $scope.elementShowingDetail = undefined;
    $scope.showEmailInfo = false;

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

    $scope.switchSubmitionDetail = function(submissionId) {

        //console.log("Switching "+submissionId);

        $scope.sapsSubmissions.forEach(function(item, index) {

            if (item.id == submissionId) {
                //console.log("Found "+submissionId);
                item.showDetail = !item.showDetail;
            }
        })
    }

    function processImages(images) {

        submissions = []

        var dateSb1 = $rootScope.parseDate("01/05/2017");
        var dateSb2 = $rootScope.parseDate("27/06/2017");

        console.log("Date 1: " + dateSb1)

        submission1 = {
            id: "sb01",
            name: "Submission 01",
            tags: ["tag1", "New tag2", "tag3"],
            region: "Region1",
            processingScript: 'scp-01',
            preProcessingScript: 'pscp-01',
            show: true,
            showDetail: false,
            date: dateSb1,
            totalImages: 0,
            totalDownloading: 0,
            totalDownloaded: 0,
            totalQueued: 0,
            totalFeched: 0,
            totalError: 0,
            images: [],
            sat4: false,
            sat5: false,
            sat7: false,
            allChecked: false
        }

        submission2 = {
            id: "sb02",
            name: "Submission 02",
            tags: [],
            region: "Region2",
            processingScript: 'scp-02',
            preProcessingScript: 'pscp-02',
            show: true,
            showDetail: false,
            date: dateSb2,
            totalImages: 0,
            totalDownloading: 0,
            totalDownloaded: 0,
            totalQueued: 0,
            totalFeched: 0,
            totalError: 0,
            images: [],
            sat4: false,
            sat5: false,
            sat7: false,
            allChecked: false
        }

        var sub1Count = 0;
        var sub2Count = 0;

        images.forEach(function(item, index) {

            var submission;
            if (index % 2 == 0) {
                sub1Count++;
                submission = submission1;
                if (sub1Count == 1) {
                    item.sat = 'L4'
                    submission1.sat4 = true;
                }
                if (sub1Count == 2) {
                    item.sat = 'L5'
                    submission1.sat5 = true;
                }
                if (sub1Count == 3) {
                    item.sat = 'L7'
                    sub1Count = 0;
                    submission1.sat7 = true;
                }
            } else {
                sub2Count++
                submission = submission2;
                if (sub1Count == 1) {
                    item.sat = 'L4'
                    submission2.sat4 = true;
                }
                if (sub1Count == 2) {
                    item.sat = 'L7'
                    sub1Count = 0;
                    submission2.sat7 = true;
                }
            }

            submission.totalImages = submission.totalImages + 1

            if (item.state === 'downloading') {
                submission.totalDownloading = submission.totalDownloading + 1
            }
            if (item.state === 'downloaded') {
                submission.totalDownloaded = submission.totalDownloaded + 1
            }
            if (item.state === 'queued') {
                submission.totalQueued = submission.totalQueued + 1
            }
            if (item.state === 'fetched') {
                submission.totalFeched = submission.totalFeched + 1
            }
            if (item.state === 'error') {
                submission.totalError = submission.totalError + 1
            }

            //Converting string to date
            item.creationTime = new Date(item.creationTime)
            item.updateTime = new Date(item.updateTime)
            item.checked = false;

            submission.images.push(item)

        })

        submissions.push(submission1);
        submissions.push(submission2);
        return submissions
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

    $scope.checkAllImages = function() {
        $scope.sapsSubmissions.forEach(function(submission, index) {
            submission.allChecked = $scope.allSubmissionsChecked;
            $scope.checkUncheckAllBySubId(submission.id)
        });
    }

    $scope.checkUncheckAllBySubId = function(submissionId) {

        for (var index = 0; index < $scope.sapsSubmissions.length; index++) {
            if ($scope.sapsSubmissions[index].id == submissionId) {
                //$scope.sapsSubmissions[index].allChecked = !$scope.sapsSubmissions[index].allChecked;
                $scope.sapsSubmissions[index].images.forEach(function(image, ind) {
                    image.checked = $scope.sapsSubmissions[index].allChecked;
                });

                break;
            }
        }
    }
    $scope.checkUncheckImageByName = function(submissionId, checked) {
        console.log("Checking for " + submissionId + " ...")
        for (var index = 0; index < $scope.sapsSubmissions.length; index++) {
            if ($scope.sapsSubmissions[index].id == submissionId) {
                if (!checked) {
                    $scope.sapsSubmissions[index].allChecked = false;
                } else {
                    var allChecked = true;
                    $scope.sapsSubmissions[index].images.forEach(function(image, ind) {
                        if (!image.checked) {
                            allChecked = false;
                        }
                    });
                    $scope.sapsSubmissions[index].allChecked = allChecked;
                }
                break;
            }
        }
    }

    $scope.getSapsSubmissions = function() {
        SubmissionService.getSubmissions(
            function(data) {
                $scope.sapsSubmissions = processImages(data);
            },
            function(error) {
                var msg = "An error occurred when tried to get Images";
                $log.error(msg + " : " + error);
                GlobalMsgService.pushMessageFail(msg)
            }
        );
    }

    $scope.sendEmail = function() {

        var imgLinks = [];
        $scope.sapsSubmissions.forEach(function(submission, index) {
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


    $scope.showDetail = function(elementId, item) {

        var detailContent =
            "<div class='col-md-12'>" +
            "<table class='sb-sub-detail-table'>" +
            "<tr>" +
            "<td class='title-col'>ID:</td>" +
            "<td>" + item.stationId + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='title-col'>State:</td>" +
            "<td>" + item.state + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='title-col'>Creation Time:</td>" +
            "<td>" + $filter('date')(item.creationTime, 'yyyy-MM-dd hh:mm:ss') + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='title-col'>Update Time:</td>" +
            "<td>" + $filter('date')(item.updateTime, 'yyyy-MM-dd hh:mm:ss') + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td class='title-col'>Version/Tag:</td>" +
            "<td><input type='text' readonly class='sb-width-lg' value='" + item.sebalVersion + "'/></td>" +
            "</tr>" +
            "<tr>" +
            "<td class='title-col'>Fmask Version</td>" +
            "<td><input type='text' readonly class='sb-width-lg' value='" + item.fmaskVersion + "'/></td>" +
            "</tr>" +
            "<tr>" +
            "<td class='title-col'>Download Link</td>" +
            "<td><input type='text' readonly class='sb-width-lg' value='" + item.downloadLink + "'/></td>" +
            "</tr>" +
            "</table>" +
            "</div>";

        //console.log(elementId+" -- "+JSON.stringify(item));
        if ($scope.elementShowingDetail !== undefined ||
            $scope.elementShowingDetail === elementId) {
            $("#" + elementId).empty();
            $("#" + elementId).addClass('hidden');
            $scope.elementShowingDetail = undefined;

        } else {


            $("#" + elementId).append(detailContent);
            $("#" + elementId).removeClass('hidden');
            $scope.elementShowingDetail = elementId;
        }
    }

    $scope.getSapsSubmissions();

});

dashboardControllers.controller('NewSubmissionsController', function($scope, $rootScope, $log, $filter,
    $timeout, AuthenticationService, SubmissionService, GlobalMsgService, appConfig) {

    $scope.modalMsgError = undefined;
    // $scope.satelliteOpts = appConfig.SATELLITE_OPTS;

    $scope.newSubmission = {
        topLeftCoord: {
            lat: 0,
            long: 0
        },
        bottomRightCoord: {
            lat: 0,
            long: 0
        },
        initialDate: undefined,
        finalDate: undefined,
        inputGathering: undefined,
        inputPreprocessing: undefined,
        algorithimExecution: undefined
    }

    // Script options
    $scope.inputGatheringOptions = [{
        name: 'DEFAULT',
        value: 'default_script'
    }, {
        name: 'Script-01',
        value: 'scp-01'
    }, {
        name: 'Script-02',
        value: 'scp-02'
    }, ]

    $scope.inputPreprocessingOptions = [{
        name: 'DEFAULT',
        value: 'default_pre-script'
    }, {
        name: 'Pre-Script-01',
        value: 'pscp-01'
    }, {
        name: 'Pre-Script-02',
        value: 'pscp-02'
    }, ]

    $scope.algorithimExecutionOptions = [{
        name: 'DEFAULT',
        value: 'default_algorithim'
    }, {
        name: 'Algo-Script-01',
        value: 'ascp-01'
    }, {
        name: 'Algo-Script-02',
        value: 'ascp-02'
    }, ]

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


    $scope.newSubmission = function() {

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

        if (!$scope.region || $scope.region.length == 0) {
            hasError = true
            msgRequiredShowHide('regionField', true);
        } else {
            msgRequiredShowHide('regionField', false);
        }

        $scope.newSubmission = {
            topLeftCoord: {
                lat: 0,
                long: 0
            },
            bottomRightCoord: {
                lat: 0,
                long: 0
            },
            initialDate: undefined,
            finalDate: undefined,
            inputGathering: undefined,
            inputPreprocessing: undefined,
            algorithimExecution: undefined
        }

        // $scope.satelliteOpts.forEach(function(item, index){

        //   var radioId = '#radioSatellite'+(index+1)

        //   if($(radioId).prop('checked')){
        //     $scope.satellite = $(radioId).prop('value');
        //   }
        //     // console.log(radioId+' Value: '+$(radioId).prop('value'))
        //     // console.log(radioId+' Checked: '+$(radioId).prop('checked'))
        // });

        // console.log('$scope.satellite: '+$scope.satellite)
        // if(!$scope.satellite){
        //   hasError = true
        //   msgRequiredShowHide('satelliteField',true);
        // }else{
        //   msgRequiredShowHide('satelliteField',false);
        // }

        if (hasError) {
            return
        }

        var data = {
            'imageName': $scope.submissionName,
            'firstYear': $scope.firstYear,
            'lastYear': $scope.lastYear,
            'region': $scope.region,
            'processingScript': $scope.processingScriptValue,
            'preProcessingScript': $scope.preProcessingScriptValue,
            'dataSet': $scope.satellite
        }

        console.log("Sending " + JSON.stringify(data));

        SubmissionService.postSubmission(data,
            function(response) {
                // GlobalMsgService.pushMessageSuccess('Your job was submitted. Wait for the processing be completed. ' 
                //       + 'If you activated the notifications you will get an email when finished.');

                $scope.openCloseModal('submissionsModal', false);

                GlobalMsgService.globalSuccessModalMsg($rootScope.languageContent.messages.successNewSubmission)
            },
            function(error) {
                $log.error(JSON.stringify(error));
                $scope.modalMsgError = 'Error while trying to submit a job.';
                //$scope.cleanForm();
            });
    };


});