var dashboardControllers = angular.module('dashboardControllers');

dashboardControllers.controller(
    'MainController',
    function(
        $scope, $rootScope, $log, $filter, $timeout, $location,
        AuthenticationService, GlobalMsgService, appConfig) {
      $scope.user = {name: '', token: ''};
      $scope.globalMsg = GlobalMsgService;
      $scope.previousButton = undefined;
      $scope.actual = undefined;

      getUserName();

      function getLangCookie(userName) {
        var cookies = document.cookie;
        var prefix = 'user-' + userName + '-lang=';
        var begin = cookies.indexOf('; ' + prefix);
        if (begin == -1) {
          begin = cookies.indexOf(prefix);
          if (begin != 0) {
            return null;
          }

        } else {
          begin += 2;
        }

        var end = cookies.indexOf(';', begin);
        if (end == -1) {
          end = cookies.length;
        }
        return unescape(cookies.substring(begin + prefix.length, end));
      }

      $scope.loadLanguagebyName = function(langOpt) {
        var lang = langLoader.getLangByName(langOpt.langName);
        if (lang !== undefined) {
          $rootScope.languageContent = lang.content;
          $rootScope.languageChosen = langOpt;
          document.cookie =
              'user-' + $scope.user.name + '-lang=' + langOpt.langName;
          //$rootScope.$apply();
        }
      };

      $scope.loadLanguagebyShortName = function(langOpt) {
        var lang = langLoader.getLangByShortName(langOpt.langShortName);
        if (lang !== undefined) {
          // console.log("New lang: "+JSON.stringify(lang.langName))
          $rootScope.languageContent = lang.content;
          $rootScope.languageChosen = langOpt;
          document.cookie =
              'user-' + $scope.user.name + '-lang=' + langOpt.langName;
          //$rootScope.$apply();
        }
      };

      $scope.activateButton =
          function(idButton) {
        $scope.previousButton = $scope.actual;
        $scope.actual = idButton;

        if ($scope.actual !== undefined) {
          // console.log("Activating "+$scope.actual);
          $('#' + idButton).addClass('span-button-selected');
        }
        if ($scope.previousButton !== undefined) {
          // console.log("Deactivating "+$scope.previousButton);
          $('#' + $scope.previousButton).removeClass('span-button-selected');
        }
      } $scope.reverseActivateButton =
              function(idButton) {
        // console.log("Reversing "+idButton);
        $scope.actual = $scope.previousButton;
        $scope.previousButton = idButton;

        if ($scope.previousButton !== undefined) {
          $('#' + $scope.previousButton).addClass('span-button-selected');
        }
        if ($scope.actual !== undefined) {
          $('#' + $scope.actual).removeClass('span-button-selected');
        }
      }

              $rootScope.showModalSuccess =
                  function(msg) {
        $scope.modalMsgSuccess = msg;
        $scope.openCloseModal('global-sucess-modal', true);
      }

                  $scope.openCloseModal =
                      function(modalId, show) {
        if (show) {
          console.log('Opening modal')
          $rootScope.$broadcast(appConfig.MODAL_OPENED);
          $('#' + modalId).modal('show')
        } else {
          $('#' + modalId).modal('hide')
          // $('#'modalId).on('hidden.bs.modal', function (e) {
          //     $rootScope.$broadcast(appConfig.MODAL_CLOSED);
          // })
        }
      }

                      $scope.doLogout =
                          function() {
        console.log('Logout success');
        AuthenticationService.doLogout();
        $location.path('/');
      }

                          $scope.clearGlobalMsg =
                              function() {
        GlobalMsgService.cleanMsg();
      }

                              function
                              getUserName() {
                                $scope.user.name =
                                    AuthenticationService.getUserName();
                              }

                              $scope.$on(
                                  appConfig.LOGIN_SUCCEED,
                                  function(event, value) {
                                    // console.log(value);
                                    // GlobalMsgService.pushMessageSuccess(value);
                                    getUserName();
                                  });

      //$scope.activateButton('monitorBtn');

      var cookieLang = getLangCookie($scope.user.name);
      if (cookieLang) {
        console.log('Loadign lang: ' + cookieLang);
        $scope.loadLanguagebyName(cookieLang);
      }
    });

dashboardControllers.controller(
    'LoginController',
    function(
        $scope, $rootScope, $log, $filter, $timeout, $location, appConfig,
        AuthenticationService, GlobalMsgService) {
      $scope.username;
      $scope.password;
      $scope.email;
      $scope.errorMsg = undefined;
      $scope.create = true;
      $scope.msg = 'Teste';

      $scope.doLogin =
          function() {
        $scope.errorMsg = undefined;
        AuthenticationService.basicSessionLogin(
            $scope.username, $scope.password,
            function() {  // Success call back
              $rootScope.$broadcast(appConfig.LOGIN_SUCCEED, 'Login succeed');
              $location.path('/submissions-list');
            },
            function(response) {  // Erro call back
              console.log('Login error: ' + JSON.stringify(response));
              $scope.errorMsg = 'Login failed.';
            });
      } $scope.loadCreateNewUser =
              function() {
        $location.path('/new-user');
      } $scope.createNewUser =
                  function() {
        if ($scope.password != $scope.passwordConfirm) {
          $scope.errorMsg = 'Senhas não conferem.'
          return
        }

        AuthenticationService.createNewUser(
            $scope.username, $scope.email, $scope.password,
            $scope.passwordConfirm,
            function(response) {  // Success call back
              //$rootScope.$broadcast(appConfig.CREATE_USER_SUCCEED, "Create
              //user succeed");
              console.log('User Created');
              $scope.msg =
                  'Obrigado =)\nNo prazo de até 3 dias você receberá\num email com a resolução de seu cadastro'
              //$location.path('/monitor');
              $scope.create = false;
            },
            function(response) {  // Erro call back
              //$rootScope.$broadcast(appConfig.CREATE_USER_FAIL, "Create user
              //failed");
              console.log('Create user error: ' + JSON.stringify(response));
              $scope.errorMsg = response;
              $scope.create = true;
            });
      }

                  $scope.clearLoginMsg = function() {
        $scope.errorMsg = undefined;
      }
    });