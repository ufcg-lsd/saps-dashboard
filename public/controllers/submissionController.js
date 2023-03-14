var dashboardControllers = angular.module("dashboardControllers");

dashboardControllers.controller(
  "ListSubmissionsController",
  function (
    $scope,
    $rootScope,
    $log,
    $timeout,
    $filter,
    SubmissionService,
    AuthenticationService,
    GlobalMsgService,
    EmailService,
    appConfig,
    NgTableParams
  ) {
    // ======= Aux Functions
    function beautifyStateNames(data) {
      if (data) {
        data.forEach(function (job, index) {
          job.state = capitalize(job.state);
        });
      }
    }

    function capitalize(string) {
      if (string) {
        return (
          string.slice(0, 1).toUpperCase() + string.slice(1, string.length).toLowerCase()
        );
      } else {
        return string;
      }
    }

    function camelCaseToSnakeCase(srt) {
      let result = srt.replace(/([A-Z])/g, " $1");
      return result.split(" ").join("_").toLowerCase();
    }

    function loadTableCompleted(search) {
      $scope.tableCompleted = new NgTableParams(
        { page: 1, count: 5 },
        {
          counts: [], //[5, 10],
          getData: function (params) {
            if (Object.keys(params._params.sorting).length === 0) {
              params._params.sorting = { creation_time: "desc" };
            }

            const reqParams = {
              search: search,
              page: params._params.page,
              size: params._params.count,
              sort: camelCaseToSnakeCase(
                JSON.stringify(params._params.sorting)
              ),
              recoverCompleted: true
            };

            return SubmissionService.getSubmissions(
              reqParams,
              function (response) {
                let data = response.data;
                beautifyStateNames(data.jobs);
                params.total(data.jobsCount);
                $scope.completedTasksCount = data.jobsCount;
                return data.jobs;
              },
              function (error) {
                var msg = "An error occurred when tried to get Images";
                GlobalMsgService.pushMessageFail(msg);
              }
            );
          },
        }
      );
    }

    function loadTableOngoing(search) {
      $scope.tableOngoing = new NgTableParams(
        { page: 1, count: 5 },
        {
          counts: [], //[5, 10],
          getData: function (params) {
            if (Object.keys(params._params.sorting).length === 0) {
              params._params.sorting = { creation_time: "desc" };
            }

            const reqParams = {
              search: search,
              page: params._params.page,
              size: params._params.count,
              sort: camelCaseToSnakeCase(
                JSON.stringify(params._params.sorting)
              ),
              recoverOngoing: true
            };

            return SubmissionService.getSubmissions(
              reqParams,
              function (response) {
                let data = response.data;
                beautifyStateNames(data.jobs);
                params.total(data.jobsCount);
                $scope.ongoingTasksCount = data.jobsCount;
                return data.jobs;
              },
              function (error) {
                var msg = "An error occurred when tried to get Images";
                GlobalMsgService.pushMessageFail(msg);
              }
            );
          },
        }
      );
    }

    function init() {
      loadTableOngoing();
      loadTableCompleted();
    }

    
    // ======= Scope Variables
    $scope.listFilter = "";

    $scope.elementShowingDetail = undefined;
    $scope.showEmailInfo = false;

    $scope.allChecked = false;

    $scope.satelliteOpts = appConfig.SATELLITE_OPTS;

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
      error: "",
    };

    $scope.processingScripts = [
      {
        name: "DEFAULT",
        value: "default_script",
      },
    ];

    $scope.preProcessingScripts = [
      {
        name: "DEFAULT",
        value: "default_pre-script",
      },
    ];

    $scope.searchFilters = {
      name: "",
      tags: "",
      region: "",
      processingScriptName: $scope.processingScripts[0].name,
      processingScriptValue: $scope.processingScripts[0].value,
      preProcessingScriptName: $scope.preProcessingScripts[0].name,
      preProcessingScriptValue: $scope.preProcessingScripts[0].value,
      satellite: "",
    };

    // ======= Scope Functions
    $scope.changeProcScript = function (newScriptOpt) {
      $scope.searchFilters.processingScriptName = newScriptOpt.name;
      $scope.searchFilters.processingScriptValue = newScriptOpt.value;
    };

    $scope.changePreProcScript = function (newScriptOpt) {
      $scope.searchFilters.preProcessingScriptName = newScriptOpt.name;
      $scope.searchFilters.preProcessingScriptValue = newScriptOpt.value;
    };

    $scope.filterSubmissions = function () {
      console.log(
        "Filtros para submissoes " + JSON.stringify($scope.searchFilters)
      );

      var isAnd = true;

      submissions.forEach(function (submission, index) {
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
          values.forEach(function (str, i) {
            if (submission.name.toLowerCase().includes(str.toLowerCase())) {
              console.log(
                "Show submission " + submission.name + " due name filter"
              );
              filterNameOk = true;
            }
          });
        } else {
          filterNameOk = true;
        }
        //If has tgas, filtering by tags
        if ($rootScope.validateString($scope.searchFilters.tags)) {
          //TODO - FIx this
          submission.tags.forEach(function (tag, i) {
            var tagParts = tag.split(" ");
            tagParts.forEach(function (tagPart, z) {
              var tagFilterParts = $scope.searchFilters.tags.split(";");
              tagFilterParts.forEach(function (filterTag, y) {
                if (tagPart.toLowerCase().includes(filterTag.toLowerCase())) {
                  console.log(
                    "Show submission " + submission.name + " due tag filter"
                  );
                  filterTagsOk = true;
                }
              });
            });
          });
        } else {
          filterTagsOk = true;
        }
        //If has Region, filtering by region
        if ($rootScope.validateString($scope.searchFilters.region)) {
          var regionValues = $scope.searchFilters.region.split(" ");
          regionValues.forEach(function (str, i) {
            if (submission.region.toLowerCase().includes(str.toLowerCase())) {
              console.log(
                "Show submission " + submission.name + " due region filter"
              );
              filterRegionOk = true;
            }
          });
        } else {
          filterRegionOk = true;
        }
        //If has satelliti, filtering by satelliti
        if ($rootScope.validateString($scope.searchFilters.satellite)) {
          if (
            $scope.searchFilters.satellite == "l4" &&
            submission.sat4 == true
          ) {
            console.log(
              "Show submission " + submission.name + " due sat4 filter"
            );
            filterSatelliteOk = true;
          }
          if (
            $scope.searchFilters.satellite == "l5" &&
            submission.sat5 == true
          ) {
            console.log(
              "Show submission " + submission.name + " due sat5 filter"
            );
            filterSatelliteOk = true;
          }
          if (
            $scope.searchFilters.satellite == "l7" &&
            submission.sat7 == true
          ) {
            console.log(
              "Show submission " + submission.name + " due sat7 filter"
            );
            filterSatelliteOk = true;
          }
        } else {
          filterSatelliteOk = true;
        }

        //If has processing script, filtering by processing script
        if ($rootScope.validateString($scope.searchFilters.processingScript)) {
          if (
            submission.processingScript == $scope.searchFilters.processingScript
          ) {
            console.log(
              "Show submission " + submission.name + " due procScript filter"
            );
            filterProcessingScriptOk = true;
          }
        } else {
          filterProcessingScriptOk = true;
        }
        //If has pre-processing script, filtering by pre-processing script
        if (
          $rootScope.validateString($scope.searchFilters.preProcessingScript)
        ) {
          if (
            submission.preProcessingScript ==
            $scope.searchFilters.preProcessingScript
          ) {
            console.log(
              "Show submission " + submission.name + " due preProcScript filter"
            );
            filterPreProcessingScriptOk = true;
          }
        } else {
          filterPreProcessingScriptOk = true;
        }

        var initialDate = undefined;
        var finalDate = undefined;

        if ($rootScope.validateDate($("#filter-initial-date-input").val())) {
          initialDate = $rootScope.parseDate(
            $("#filter-initial-date-input").val()
          );
        }

        if ($rootScope.validateDate($("#filter-final-date-input").val())) {
          finalDate = $rootScope.parseDate($("#filter-final-date-input").val());
        }

        if (initialDate && finalDate) {
          if (submission.date >= initialDate && submission.date <= finalDate) {
            console.log(
              "Show submission " + submission.name + " due dates filter"
            );
            filterInitialDateOk = true;
            filterFinalDateOk = true;
          }
        } else {
          if (!initialDate) {
            filterInitialDateOk = true;
          } else if (initialDate && submission.date == initialDate) {
            console.log(
              "Show submission " + submission.name + " due initialDate filter"
            );
            filterInitialDateOk = true;
          }
          if (!finalDate) {
            filterFinalDateOk = true;
          } else if (finalDate && submission.date == finalDate) {
            console.log(
              "Show submission " + submission.name + " due finalDate filter"
            );
            filterFinalDateOk = true;
          }
        }

        if (isAnd) {
          if (
            filterNameOk &&
            filterTagsOk &&
            filterRegionOk &&
            filterSatelliteOk &&
            filterInitialDateOk &&
            filterFinalDateOk &&
            filterProcessingScriptOk &&
            filterPreProcessingScriptOk
          ) {
            submission.show = true;
          }
        } else {
          if (
            filterNameOk ||
            filterTagsOk ||
            filterRegionOk ||
            filterSatelliteOk ||
            filterInitialDateOk ||
            filterFinalDateOk ||
            filterProcessingScriptOk ||
            filterPreProcessingScriptOk
          ) {
            submission.show = true;
          }
        }
      });
    };

    $scope.generateTagsComponent = function (submission) {
      if (submission.tagListComponent == undefined) {
        console.log("Gerando tags para: " + submission.id);
        //Creating tag component
        var jnlitemListConfg = {
          target: submission.id + "-tags-div",
          items: submission.tags,
          options: {
            editButton: undefined,
            permanentInput: false,
          },
        };

        var tagList = lnil.NLItemsList(jnlitemListConfg);
        submission.tagListComponent = tagList;
        submission.tagListComponent.on("listchange", function (newList) {
          $scope.$apply(function () {
            submission.tags = submission.tagListComponent.getValues();
          });
        });
      }
    };

    $scope.setChecked = function (value, tasks) {
      for (var i = 0; i < tasks.length; i++) {
        tasks[i].checked = value;
      }
    };

    $scope.sendEmail = function () {
      var imgLinks = [];
      $scope.tasksByState.forEach(function (submission, index) {
        if (submission.checked) {
          submission.images.forEach(function (img, i) {
            if (img.checked) {
              var newImgLinks = {
                imgName: img.name,
                links: [],
              };
              img.satellites.forEach(function (sat, ind) {
                if (sat.link != undefined) {
                  newImgLinks.links.push(sat.link);
                }
              });
              if (newImgLinks.links.length > 0) {
                imgLinks.push(newImgLinks);
              }
            }
          });
        }
      });

      var email = {
        email: AuthenticationService.getUserName(),
        links: imgLinks,
      };
      console.log("Sending " + JSON.stringify(email));

      EmailService.sendEmail(
        email,
        function (data) {
          console.log("Return: " + JSON.stringify(data));
          GlobalMsgService.globalSuccessModalMsg(
            $rootScope.languageContent.messages.sendEmailSuccess
          );
        },
        function (error) {
          console.log("Error: " + JSON.stringify(error));
        }
      );
    };

    $scope.filterTable = function (search) {
        loadTableOngoing(search);
        loadTableCompleted(search);
    };

    $scope.openCloseTasksModal = function (open, job) {
      $scope.modalOpen = true;
      $scope.openCloseModal('tasksModal', open);
      $rootScope.$broadcast('handleOpenTasksModal', {
        jobData: job
      });
      console.log(open)
    }

    init();
  }
);

dashboardControllers.controller(
  "NewSubmissionsController",
  function (
    $scope,
    $rootScope,
    $log,
    $filter,
    $timeout,
    AuthenticationService,
    SubmissionService,
    GlobalMsgService,
    appConfig
  ) {
    $scope.modalMsgError = undefined;

    // Script options
    $scope.inputGatheringOptions = appConfig.scriptsTags.inputdownloading;
    $scope.inputPreprocessingOptions = appConfig.scriptsTags.preprocessing;
    $scope.algorithmExecutionOptions = appConfig.scriptsTags.processing;

    $scope.$on(appConfig.MODAL_OPENED, function (event, value) {
      $scope.cleanForm();
    });
    $scope.$on(appConfig.MODAL_CLOSED, function (event, value) {
      $scope.cleanForm();
    });
    
	
   $scope.minDate = new Date(1984, 1 - 1, 1);

   var today = new Date()
   $scope.maxDate = today;
 

    function msgRequiredShowHide(fieldId, show) {
      requiredMsg = $("#" + fieldId).find(".sb-required");

      if (requiredMsg) {
        if (show) {
          requiredMsg.removeClass("sb-hidden");
        } else {
          requiredMsg.addClass("sb-hidden");
        }
      }
    }

    $scope.cleanForm = function () {
      $scope.submissionName = undefined;

      $scope.newSubmission = {
        label: undefined,
        lowerLeftCoord: {
          lat: -8.676947,
          long: -37.095067,
          // lat: 0.0,
          // long: 0.0
        },
        upperRightCoord: {
          lat: -8.676947,
          long: -37.095067,
          // lat: 0.0,
          // long: 0.0
        },
        initialDate: undefined,
        finalDate: undefined,
        inputGathering: $scope.inputGatheringOptions[0],
        inputPreprocessing: $scope.inputPreprocessingOptions[0],
        algorithmExecution: $scope.algorithmExecutionOptions[0],
        priority: 1,
      };
      //Clean error msgs
      $scope.modalMsgError = undefined;
    };

    $scope.processNewSubmission = function () {
      var data = {};

      hasError = false;
      $scope.modalMsgError = undefined;

      if (
        $scope.newSubmission.lowerLeftCoord.lat === undefined ||
        $scope.newSubmission.lowerLeftCoord.long === undefined ||
        $scope.newSubmission.upperRightCoord.lat === undefined ||
        $scope.newSubmission.upperRightCoord.long === undefined
      ) {
        GlobalMsgService.globalSuccessModalMsg(
          $rootScope.languageContent.messages.failCoordinatesRequired
        );
        return;
      } else {
        if (
          isNaN($scope.newSubmission.lowerLeftCoord.lat) ||
          isNaN($scope.newSubmission.lowerLeftCoord.long) ||
          isNaN($scope.newSubmission.upperRightCoord.lat) ||
          isNaN($scope.newSubmission.upperRightCoord.long)
        ) {
          GlobalMsgService.globalSuccessModalMsg(
            $rootScope.languageContent.messages.failCoordinatesNotNumber
          );
          return;
        }
        data.lowerLeft = [
          parseFloat($scope.newSubmission.lowerLeftCoord.lat) + 0.5,
          parseFloat($scope.newSubmission.lowerLeftCoord.long) + 0.5,
        ];
        data.upperRight = [
          parseFloat($scope.newSubmission.upperRightCoord.lat) - 0.5,
          parseFloat($scope.newSubmission.upperRightCoord.long) - 0.5,
        ];
      }

      if ($scope.newSubmission.label === undefined) {
        GlobalMsgService.globalSuccessModalMsg(
          $rootScope.languageContent.messages.failLabelRequired
        );
        return;
      }
      if ($scope.newSubmission.initialDate === undefined) {
        GlobalMsgService.globalSuccessModalMsg(
          $rootScope.languageContent.messages.failInitialDateRequired
        );
        return;
      } else {
        data.initialDate = $scope.newSubmission.initialDate
          .toISOString()
          .slice(0, 11);
      }
      if ($scope.newSubmission.finalDate === undefined) {
        GlobalMsgService.globalSuccessModalMsg(
          $rootScope.languageContent.messages.failFinalDateRequired
        );
        return;
      } else {
        data.finalDate = $scope.newSubmission.finalDate
          .toISOString()
          .slice(0, 11);
      }
      if ($scope.newSubmission.initialDate > $scope.newSubmission.finalDate) {
        GlobalMsgService.globalSuccessModalMsg(
          $rootScope.languageContent.messages.failDateInvalid
        );
        return;
      }
      if (
        $scope.newSubmission.priority < 1 ||
        $scope.newSubmission.priority > 100
      ) {
        GlobalMsgService.globalSuccessModalMsg(
          $rootScope.languageContent.messages.failPriorityRange
        );
        return;
      } else {
        data.priority = $scope.newSubmission.priority;
      }
      data.inputGatheringTag = $scope.newSubmission.inputGathering.name;
      data.inputPreprocessingTag = $scope.newSubmission.inputPreprocessing.name;
      data.algorithmExecutionTag = $scope.newSubmission.algorithmExecution.name;
      data.label = $scope.newSubmission.label;
      data.email = AuthenticationService.getUserName();

      console.log("Sending " + JSON.stringify(data));
      $scope.openCloseModal("submissionsModal", false);
      GlobalMsgService.globalSuccessModalMsg(
        "Submission sent.\n It might take some time to include all tasks."
      );
      // $rootScope.loadingModalMessage = $rootScope.languageContent.mapFeature.submissionBox.label.loadSubmission;
      // $scope.openCloseModal('loadingModal', true);

      SubmissionService.postSubmission(
        data,
        function (response) {
          // GlobalMsgService.pushMessageSuccess('Your job was submitted. Wait for the processing be completed. '
          //       + 'If you activated the notifications you will get an email when finished.');
          // $scope.openCloseModal('loadingModal', false);

          console.log(response);
          if (typeof response.data === "string") {
            if ( response.data === $rootScope.languageContent.messages.notFoundLandsatImage )
              GlobalMsgService.globalSuccessModalMsg(
                $rootScope.languageContent.messages.notFoundLandsatImage
              );
          } else {
            GlobalMsgService.globalSuccessModalMsg(
              $rootScope.languageContent.messages.successNewSubmission
            );
          }
        },
        function (error) {
          $log.error(JSON.stringify(error));
          // $scope.openCloseModal('loadingModal', false);
          if (error.code == 401) {
            GlobalMsgService.globalSuccessModalMsg(
              $rootScope.languageContent.messages.unauthorizedNewSubmission
            );
          } else {
            GlobalMsgService.globalSuccessModalMsg(
              $rootScope.languageContent.messages.failedNewSubmission
            );
          }
        }
      );
    };
  }
);

dashboardControllers.controller(
  "TaskModalController",
  function (
    $scope,
    $rootScope,
    $log,
    $filter,
    $timeout,
    AuthenticationService,
    SubmissionService,
    GlobalMsgService,
    NgTableParams,
  ) {

    function beautifyStateNames(data) {
      if (data) {
        data.forEach(function (task, index) {
          if (task.state === "archived") {
            task.state = "success";
          } else if (task.state === "failed") {
            task.state = "failure";
          }

          task.state = capitalize(task.state);
        });
      }
    }

    function capitalize(string) {
      if (string) {
        return (
          string.slice(0, 1).toUpperCase() + string.slice(1, string.length)
        );
      } else {
        return string;
      }
    }

    function camelCaseToSnakeCase(srt) {
      let result = srt.replace(/([A-Z])/g, " $1");
      return result.split(" ").join("_").toLowerCase();
    }

    function loadTasksTable(jobId, search) {
      $scope.tasksTable = new NgTableParams(
        { page: 1, count: 5 },
        {
          counts: [5, 10, 15],
          getData: function (params) {
            if (Object.keys(params._params.sorting).length === 0) {
              params._params.sorting = { creation_time: "desc" };
            }

            const reqParams = {
              search: search,
              page: params._params.page,
              size: params._params.count,
              sort: camelCaseToSnakeCase(
                JSON.stringify(params._params.sorting)
              ),
              jobId: jobId,
            };

            return SubmissionService.getSubmissions(
              reqParams,
              function (response) {
                let data = response.data;

                $scope.selectedJob = {
                  ...$scope.selectedJob, 
                  tasksAmount: data.tasksAmount,
                  tasksOngoing: data.tasksOngoing,
                  tasksFailed: data.tasksFailed, 
                  tasksArchived: data.tasksArchived,
                }

                params.total(data.tasksAmount);
                beautifyStateNames(data.tasks);
                return data.tasks;
              },
              function (error) {
                var msg = "An error occurred when tried to get Images";
                GlobalMsgService.pushMessageFail(msg);
              }
            );
          },
        }
      );
    }

    $rootScope.$on("handleOpenTasksModal", function (event, data) {
      $scope.selectedJob = data.jobData;
      loadTasksTable(data.jobData.jobId);
    });

    $scope.openCloseModal('taskModal', false);

    $scope.filterTable = function (search) {
      let rgx_date_y = /^\d{0,4}\-?$/;
      let rgx_date_y_m0 = /^\d{4}\-[01]\-?$/;
      let rgx_date_y_m1 = /^\d{4}\-0[1-9]\-?$/;
      let rgx_date_y_m2 = /^\d{4}\-1[0-2]\-?$/;
      let rgx_date_y_m_d0 = /^\d{4}\-0[1-9]\-0[1-9]?$/;
      let rgx_date_y_m_d1 = /^\d{4}\-0[1-9]\-[12][0-9]?$/;
      let rgx_date_y_m_d2 = /^\d{4}\-0[1-9]\-3[01]?$/;
      let rgx_date_y_m_d3 = /^\d{4}\-1[0-2]\-0[1-9]?$/;
      let rgx_date_y_m_d4 = /^\d{4}\-1[0-2]\-[12][0-9]?$/;
      let rgx_date_y_m_d5 = /^\d{4}\-1[0-2]\-3[01]?$/;

      const validEmptySearch = String(search).trim() === "";

      const validDateSearch =
        rgx_date_y.test(search) ||
        rgx_date_y_m0.test(search) ||
        rgx_date_y_m1.test(search) ||
        rgx_date_y_m2.test(search) ||
        rgx_date_y_m_d0.test(search) ||
        rgx_date_y_m_d1.test(search) ||
        rgx_date_y_m_d2.test(search) ||
        rgx_date_y_m_d3.test(search) ||
        rgx_date_y_m_d4.test(search) ||
        rgx_date_y_m_d5.test(search)

      if (validDateSearch) {
        loadTasksTable($scope.selectedJob.jobId, search);
        GlobalMsgService.cleanMsg();
      } else if (validEmptySearch) {
        loadTasksTable($scope.selectedJob.jobId);
        GlobalMsgService.cleanMsg();
      } else {
        GlobalMsgService.pushMessageWarning(
          $rootScope.languageContent.submissionsList.taskFilterBox.error
        );
      }
    };
  }
);
