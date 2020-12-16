var dashboardServices = angular.module('dashboardServices', ['ngResource']);

dashboardServices.service('GlobalMsgService', function() {
  var message;
  this.cleanMsg = function() {
    message = {content: undefined, level: undefined}
  };

  this.cleanMsg();

  this.pushMessageAlert = function(msg) {
    message.content = msg;
    message.level = 'alert-info';
  };
  this.pushMessageSuccess = function(msg) {
    message.content = msg;
    message.level = 'alert-success';
  };
  this.pushMessageInfo = function(msg) {
    message.content = msg;
    message.level = 'alert-info';
  };
  this.pushMessageWarning = function(msg) {
    message.content = msg;
    message.level = 'alert-warning';
  };
  this.pushMessageFail = function(msg) {
    message.content = msg;
    message.level = 'alert-danger';
  };
  this.getContent =
      function() {
    return message.content;
  } this.getLevel =
          function() {
    return message.level;
  }

          this.globalSuccessModalMsg = function(msg) {
    var htmlMsg = '<div id=\'msg\'>' + msg + '</div>'
    var msgBody = $('#global-sucess-modal').find('#msg-body')
    var previousMSG = msgBody.find('#msg');
    if (previousMSG) {
      previousMSG.remove();
    }
    msgBody.append(htmlMsg);
    $('#global-sucess-modal').modal('show');
  }
});

dashboardServices.service(
    'AuthenticationService', function($log, $http, Session, appConfig) {
      var resourceAuthUrl = appConfig.urlSapsService + appConfig.authPath;
      var resourceCreateUrl =
          appConfig.urlSapsService + appConfig.authCreatePath;
      var authService = {};

      var getCredentials = function() {
        if (Session.getUser().token !== undefined) {
          return {
            'auth-token': Session.getUser().token
          }
        } else {
          // console.log("Returning: "+JSON.stringify({'userEmail':
          // Session.getUser().login, 'userPass': Session.getUser().pass}));
          return {
            'Access-Control-Allow-Origin': '*',
                'userEmail': Session.getUser().login,
                'userPass': Session.getUser().pass
          }
        }
      };

      authService.basicSessionLogin =
          function(userLogin, password, callbackSuccess, callbackError) {
        var userName = userLogin;  // For now user name is the login.
        Session.createBasicSession(userName, userLogin, password);
        var headerCredentials = getCredentials();

        var loginSuccessHandler = function(response) {
          // console.log("Return: "+JSON.stringify(response));
          callbackSuccess(response)
        };

        var loginErrorHandler = function(error) {
          console.log('Error no login: ' + JSON.stringify(error))
          Session.destroy();
          callbackError(error);
        };
        // console.log("Getting images with headers:
        // "+JSON.stringify(headerCredentials))
        var loginInfo = $.param({'userEmail': userLogin, 'userPass': password});
        $http.post(resourceAuthUrl, loginInfo)
            .then(loginSuccessHandler, loginErrorHandler);
      }

          authService.tokenSessionLogin = function(
              userLogin, password, callbackSuccess, callbackError) {
        // Implement clientside encriptography ??
        // LOGIN_SUCCEED, LOGIN_FAILED, LOGOUT_SUCCEED
        Session.createTokenSession(username, authToken);

        $http.get(resourceAuthUrl, {headers: {'x-auth-token': sessionToken}})
            .then(
                function(response) {
                  // console.log("Return: "+JSON.stringify(response));
                  var authToken = 'TOKEN-SEBAL'  // fix this hardcode to get
                                                 // token from HEADERS
                  callbackSuccess(response)
                },
                function(error) {
                  Session.destroy();
                  callbackError(error);
                });
      };

      authService.mockLogin = function(
          username, password, callbackSuccess, callbackError) {
        if (!username || !password) {
          Session.destroy();
          callbackError('Username and Password are required');
        } else {
          Session.create(username, password);
          callbackSuccess('success');
        }
      };

      authService.doLogout = function() {
        Session.destroy();
      };

      authService.createNewUser =
          function(
              name, email, password, passwordConfirm, callbackSuccess,
              callbackError) {
        // Session.createBasicSession(userName, email, password);
        var newUser = $.param({
          'userEmail': email,
          'userName': name,
          'userPass': password,
          'userPassConfirm': passwordConfirm,
          'userNotify': 'no'
        });
        $http.post(resourceCreateUrl, newUser)
            .then(callbackSuccess, callbackError);
      }

          authService.getUserName = function() {
        return Session.getUser().name;
      };

      authService.getUserLogin = function() {
        return Session.getUser().login;
      };

      authService.getUserPass = function() {
        return Session.getUser().pass;
      };

      authService.getCheckUser = function() {
        return Session.getUser().login !== undefined;
      };

      authService.getHeaderCredentials = getCredentials;

      return authService;
    });

dashboardServices.service('Session', function() {
  this.user =
      {name: undefined, login: undefined, pass: undefined, token: undefined};

  if (window.sessionStorage.user) {
    if (JSON.parse(window.sessionStorage.user).login !== undefined) {
      this.user = JSON.parse(window.sessionStorage.user);
    }
  } else {
    window.sessionStorage.user = JSON.stringify(this.user);
  }

  if (JSON.parse(window.sessionStorage.user).login === undefined) {
    window.sessionStorage.user = JSON.stringify(this.user);
  } else {
    this.user = JSON.parse(window.sessionStorage.user);
  }

  this.createTokenSession = function(userName, userToken) {
    console.log('Creating Token Session ') this.user = {
      name: userName,
      token: userToken
    };
    window.sessionStorage.user = JSON.stringify(this.user);
  };
  this.createBasicSession = function(userName, login, pass) {
    console.log('Creating Basic Session ') this
        .user = {name: userName, login: login, pass: pass};
    window.sessionStorage.user = JSON.stringify(this.user);
  };
  this.destroy = function() {
    this.user =
        {name: undefined, login: undefined, pass: undefined, token: undefined};
    window.sessionStorage.user = JSON.stringify(this.user);
  };
  this.getUser = function() {
    return JSON.parse(window.sessionStorage.user);
  };
});

dashboardServices.service(
    'SubmissionService',
    function($log, $http, AuthenticationService, appConfig) {
      var resourceUrl = appConfig.urlSapsService + appConfig.submissionPath;
      var submissionService = {};

      submissionService.getSubmissions = function(
          successCallback, errorCallback) {
        var headerCredentials = AuthenticationService.getHeaderCredentials();

        $http.get(resourceUrl, {headers: headerCredentials})
            .then(successCallback, errorCallback);
      };

      submissionService.postSubmission = function(
          dataForm, successCallback, errorCalback) {
        var headerCredentials = AuthenticationService.getHeaderCredentials();

        var submissionSuccessHandler = function(response) {
          // console.log("Return: "+JSON.stringify(response));
          successCallback(response);
        };
        var submissionErrorHandler = function(error) {
          console.log('Error on submission: ' + JSON.stringify(error));
          errorCalback(error);
        };
        dataForm.userEmail = headerCredentials.userEmail;
        dataForm.userPass = headerCredentials.userPass;
        var dataInfo = $.param(dataForm);
        $http.post(resourceUrl, dataInfo, {timeout: 86400000})
            .then(submissionSuccessHandler, submissionErrorHandler);
      };

      return submissionService;
    });

dashboardServices.service(
    'RegionService', function($log, $http, AuthenticationService, appConfig) {
      var resourceDetailsUrl =
          appConfig.urlSapsService + appConfig.regionDetailsPath;
      var resourceSubmitSearch =
          appConfig.urlSapsService + appConfig.imagesProcessedSearch;
      var resourceEmail = appConfig.urlSapsService + appConfig.emailPath;
      var regionService = {};

      regionService.getRegions = function(successCallback, errorCalback) {
        fetch('/regions/regions.geojson')
            .then(function(response) {
              return response.json();
            })
            .then(function(json) {
              json.features.forEach(function(poly) {
                poly.properties.processedImages = 0;
                poly.properties.totalImgBySatelitte = [
                  {name: 'L4', total: 0}, {name: 'L5', total: 0},
                  {name: 'L7', total: 0}
                ]
                poly.properties.selected = false;
              })
              successCallback(json);
            });
      };

      regionService.getRegionsDetails = function(
          successCallback, errorCallback) {
        var headerCredentials = AuthenticationService.getHeaderCredentials();
        var config = {
          url: resourceDetailsUrl,
          method: 'GET',
          headers: headerCredentials
        }

                     $http(config)
                         .then(successCallback, errorCallback);
      };

      regionService.postSearch = function(
          data, successCallback, errorCallback) {
        var headerCredentials = AuthenticationService.getHeaderCredentials();
        data.userEmail = headerCredentials.userEmail;
        data.userPass = headerCredentials.userPass;
        var dataInfo = $.param(data);
        $http.post(resourceSubmitSearch, dataInfo)
            .then(successCallback, errorCallback);
      };

      regionService.sendEmail =
          function(data, successCallback, errorCallback) {
        var headerCredentials = AuthenticationService.getHeaderCredentials();
        data.userEmail = headerCredentials.userEmail;
        data.userPass = headerCredentials.userPass;
        var dataInfo = $.param(data);
        $http.post(resourceEmail, dataInfo)
            .then(successCallback, errorCallback);
      }

      return regionService;
    });

dashboardServices.service(
    'EmailService', function($log, $http, AuthenticationService, appConfig) {
      var resourceUrl = appConfig.urlSapsService + appConfig.emailPath;
      var emailService = {};

      emailService.sendEmail = function(email, successCallback, errorCalback) {
        var data = {
          data: email,
        } var headerCredentials = AuthenticationService.getHeaderCredentials();
        $http.post(resourceUrl, data, {headers: headerCredentials})
            .then(successCallback, errorCalback);
      };

      return emailService;
    });