var express = require('express');
var fs = require("fs");
var exec = require('child_process').exec;
var router = express.Router();

var imagesFile = "/mockFiles/images.json";
var regionsFile = "/saps_files/regions.json";
var regionsDetailsFile = "/mockFiles/regions_details.json";
var userFile = "/mockFiles/users.json";

var response = {
    "status": undefined,
    "code": undefined,
    "data": undefined
}

var startApi = function() {

    //console.log("Starting Sebal api");

    var loadFileInfo = function(fileName, isJson, callbackFunction) {

        fs.readFile(__dirname + fileName, 'utf8', function(err, data) {

            if (err) {
                callbackFunction(undefined);
            } else {
                var content = data;
                if (isJson) {
                    content = JSON.parse(content)
                }
                callbackFunction(content)
            }

        });
    }


    var api = {
        authenticate: function(userInfo, callbackFunction) {
            loadFileInfo(userFile, true, function(content) {
                // Status code:
                /*
                 * 200 - User authorized
                 * 401 - Wrong credentials 
                 * 403 - User not active yet
                 * 404 - User not found
                 */
                var userValidation = {
                    valid: false,
                    code: 404,
                    msg: "User not found."
                };
                if (content != undefined) {
                    var users = content;
                    if (Array.isArray(users)) {
                        users.forEach(function(user, index) {
                            if (user.userEmail == userInfo.userEmail) {
                                if (user.userPass == userInfo.userPass) {
                                    if (user.status == "active") {
                                        userValidation.valid = true;
                                        userValidation.code = 200;
                                        userValidation.msg = "User validated with success."
                                    } else {

                                        userValidation.valid = false;
                                        userValidation.code = 403;
                                        userValidation.msg = "User not active."
                                    }
                                } else {
                                    userValidation.valid = false;
                                    userValidation.code = 401;
                                    userValidation.msg = "Wrong credentials."
                                }
                            }
                        });
                    }
                }
                //console.log("User valild? "+userValid)
                callbackFunction(userValidation);
            })
        },
        createUser: function(userInfo, callbackFunction) {
            loadFileInfo(userFile, true, function(content) {

                var newUser = {
                    "userEmail": userInfo.userEmail,
                    "userPass": userInfo.userPass
                }

                var users = []

                if (content != undefined) {
                    users = content;
                }

                if (users.length > 0) {
                    users.forEach(function(user, index) {
                        if (user.userEmail == userInfo.userEmail) {
                            var response = {
                                "resp": "ERROR",
                                "status": undefined,
                                "code": 500,
                                "data": "Error. User with this email already exists"
                            }
                            callbackFunction(response);
                        }

                    });
                }

                users.push(newUser)

                var usersStr = JSON.stringify(users);

                fs.writeFile(__dirname + userFile, usersStr, function(err) {

                    var response = {
                        "resp": undefined,
                        "status": undefined,
                        "code": undefined,
                        "data": ""
                    }

                    if (err) {
                        response.status = "ERROR";
                        response.code = 401;
                        response.data = "Error while creating user";
                    } else {
                        response.status = "SUCCESS"
                        response.code = 200;
                        response.data = "User successfulyy created."
                    }

                    callbackFunction(response);
                });
            })
        },
        getImages: function(userInfo, callbackFunction) {

            this.authenticate(userInfo, function(authenticatedUser) {

                var response = {
                    "resp": undefined,
                    "status": undefined,
                    "code": undefined,
                    "data": ""
                }

                if (!authenticatedUser.valid) {
                    response.status = "ERROR";
                    response.code = authenticatedUser.code;
                    response.data = authenticatedUser.msg;
                    callbackFunction(response);
                } else {
                    loadFileInfo(imagesFile, true, function(content) {

                        if (content == undefined) {
                            response.status = "ERROR";
                            response.code = 401;
                            response.data = "User unauthorized";
                            callbackFunction(response);
                        } else {
                            response.status = "SUCCESS"
                            response.code = 200;
                            response.data = content
                        }
                    });
                }
            });
        },
        getImage: function(userInfo, imageId, callbackFunction) {
            console.log("Returning mock specific image")
        },
        getRegions: function(userInfo, callbackFunction) {
            var response = {
                "resp": undefined,
                "status": undefined,
                "code": undefined,
                "data": ""
            }
            this.authenticate(userInfo, function(authenticatedUser) {
                if (!authenticatedUser.valid) {
                    response.status = "ERROR";
                    response.code = authenticatedUser.code;
                    response.data = authenticatedUser.msg;
                    callbackFunction(response);
                } else {
                    loadFileInfo(regionsFile, true, function(content) {
                        if (content == undefined) {
                            response.status = "ERROR";
                            response.code = 401;
                            response.data = "User unauthorized";
                        } else {
                            response.status = "SUCCESS"
                            response.code = 200;
                            response.data = content
                        }
                        callbackFunction(response);
                    });
                }
            });
        },
        getRegionsDetails: function(userInfo, regionNames, callbackFunction) {

            var response = {
                "resp": undefined,
                "status": undefined,
                "code": undefined,
                "data": ""
            }
            this.authenticate(userInfo, function(authenticatedUser) {

                if (!authenticatedUser.valid) {
                    response.status = "ERROR";
                    response.code = authenticatedUser.code;
                    response.data = authenticatedUser.msg;
                    callbackFunction(response);
                } else {
                    loadFileInfo(regionsDetailsFile, true, function(content) {
                        if (content == undefined) {
                            response.status = "ERROR";
                            response.code = 500;
                            response.data = "Error while getting regions details";
                        } else {
                            var responseData = [];
                            var regionsDetails = content;
                            regionNames.forEach(function(regionName, index) {

                                for (count = 0; count < regionsDetails.length; count++) {
                                    if (regionName == regionsDetails[count].regionName) {
                                        responseData.push(regionsDetails[count]);
                                        break;
                                    }
                                }

                            });

                            response.status = "SUCCESS"
                            response.code = 200;
                            response.data = responseData;
                        }
                        callbackFunction(response);
                    });
                }
            });
        },
        sendEmail: function(userInfo, data, callbackFunction) {
            var response = {
                "resp": "OK",
                "status": "SUCCESS",
                "code": 200,
                "data": "Email will be sent to " + data.email
            }
            callbackFunction(response);
        },
    };

    module.exports = api;
}

startApi();