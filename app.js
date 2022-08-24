var express = require('express');
var path = require('path');
var fs = require("fs");
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var sebalApi;

var app = express();

var appConfig;

var reqUserInfo = {
    "userEmail": undefined,
    "userPass": undefined,
    "authToken": undefined
}

var tokenHeader = "x-auth-token";
var userEmailHeader = "useremail";
var userPassHeader = "userpass";
var credentialsHeader = "x-auth-credentials";

var logger;

var loadAppConfig = function() {

    fs.readFile(__dirname + "/" + "backend.config", 'utf8', function(err, data) {

        appConfig = JSON.parse(data);

        //Creating log
        logger = (function() {

            var logNumberLevel;
            if (appConfig.logLevel == "DEBUG") {
                logNumberLevel = 0;
            } else if (appConfig.logLevel == "INFO") {
                logNumberLevel = 1;
            } else if (appConfig.logLevel == "WARNING") {
                logNumberLevel = 2;
            } else {
                logNumberLevel = 3;
            }

            api = {
                debug: function(text) {
                    if (logNumberLevel == 0) {
                        console.log("DEBUG: " + text);
                    }
                },
                info: function(text) {
                    if (logNumberLevel <= 1) {
                        console.log("INFO: " + text);
                    }
                },
                warning: function(text) {
                    if (logNumberLevel <= 2) {
                        console.log("WARNING: " + text);
                    }
                },
                error: function(text) {
                    if (logNumberLevel <= 3) {
                        console.log("ERROR: " + text);
                    }
                }
            }
            return api;
        })();

        startApp();
    });

}


var startApp = function() {
    logger.debug("Start app")
    //Starting configurations
    if (appConfig.devMode) {
        logger.warning("** ATENTION - STARTING APP IN DEV MODE **")
        sebalApi = require('./routes/sebalMockApi.js');
    } else {
        sebal = require('./routes/sebalApi.js');
        sebalApi = sebal.SebalApi(appConfig.saps);
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use('/', express.static(path.join(__dirname, '/public'))); //Point to Angular frontend content

    /**** API TO RETURN DATA TO FRONTEND ****/
    /*  
        - images
        - regions
    */
    app.get("/auth", extractUserInfo, function(req, res) {

        logger.debug("Authenticating user")

        sebalApi.authenticate(reqUserInfo, function(validUser) {
            console.log("Validation: " + JSON.stringify(validUser))
            res.status(validUser.code);
            res.end(validUser.msg);

        });

    });

    app.post("/auth/create", function(req, res) {

        logger.debug("Creating user")
        var data = req.body.data;
        var callbackFunction = registerCallBack(handleResponsePassthrough, req, res);
        sebalApi.createUser(data, callbackFunction);

    });

    //Return list of images
    app.get("/images", extractUserInfo, function(req, res) {
        logger.debug("Getting images")
        var callbackFunction = registerCallBack(handleGetImages, req, res);
        sebalApi.getImages(reqUserInfo, callbackFunction);

    });

    app.get("/regions", extractUserInfo, function(req, res) {
        logger.debug("Getting regions")
        var callbackFunction = registerCallBack(handleGetRegionsResponse, req, res);
        sebalApi.getRegions(reqUserInfo, callbackFunction);

    });

    app.get("/regions/details", extractUserInfo, function(req, res) {
        var regionsNames = req.query.regionsNames.split(',');
        logger.debug("Getting regions details")
        var callbackFunction = registerCallBack(handleGetRegionsDetailsResponse, req, res);
        sebalApi.getRegionsDetails(reqUserInfo, regionsNames, callbackFunction);

    });

    app.get("/regions/search", extractUserInfo, function(req, res) {
        var regionsNames = req.query.regionsNames.split(',');
        logger.debug("Getting regions details")
        var callbackFunction = registerCallBack(handleGetRegionsDetailsResponse, req, res);
        sebalApi.getRegionsDetails(reqUserInfo, regionsNames, callbackFunction);

    });

    app.post("/email", extractUserInfo, function(req, res) {
        var data = req.body.data;
        logger.debug("Sending email: " + JSON.stringify(data))
        var callbackFunction = registerCallBack(handleSendEmailResponse, req, res);
        sebalApi.sendEmail(reqUserInfo, data, callbackFunction);

    });

    app.get('/SAPS_terms_of_usage.pdf', function (req, res) {
        res.sendFile(path.join(__dirname, '/public/assets/pdf', 'SAPS_terms_of_usage.pdf'))
    });

    app.get('/SAPS_privacy_policy.pdf', function (req, res) {
        res.sendFile(path.join(__dirname, '/public/assets/pdf', 'SAPS_privacy_policy.pdf'))
    });  

    app.get('*', function (req, res) {
        res.redirect(308, '/');
    });

    app.listen(appConfig.port, function(err, res) {
        if (err) {
            logger.error("Error while starting server");
        } else {
            logger.info("Running at " + appConfig.port);
        }
    });

    //**** CALLBACK FUNCTIONS TO HANDLE SEBAL API RESPONSES ****//
    function registerCallBack(callBackfunction, httpReq, httpRes) {
        return function(response) {
            callBackfunction(response, httpReq, httpRes);
        }
    }

    function handleResponsePassthrough(response, httpReq, httpRes) {
        httpRes.status(response.code);
        var data;
        if (typeof response.data == 'string') {
            data = response.data
        } else {
            data = JSON.stringify(response.data)
        }
        httpRes.end(data);
    }

    function handleGetImages(response, httpReq, httpRes) {
        httpRes.status(response.code);
        httpRes.end(JSON.stringify(response.data));
    }

    //TODO create one handle for each API endpoint? Format response for FRONTEND
    function handleGetRegionsResponse(responseRegions, httpReq, httpRes) {

        var regionsNames = [];

        if (responseRegions.code == 200) {
            responseRegions.data.forEach(function(item, index) {
                regionsNames.push(item.regionName);
            })
            logger.debug("Getting details w/ user: " + JSON.stringify(reqUserInfo))
            sebalApi.getRegionsDetails(reqUserInfo, regionsNames, function(regionDetailsResponse) {
                if (Array.isArray(regionDetailsResponse.data)) {
                    regionDetailsResponse.data.forEach(function(regionDetail, index) {

                        var l4 = {
                            name: "L4",
                            total: 0
                        };
                        var l5 = {
                            name: "L5",
                            total: 0
                        };
                        var l7 = {
                            name: "L7",
                            total: 0
                        };
                        totalImgBySatelitte = [];

                        regionDetail.processedImages.forEach(function(processedImage, ind) {
                            processedImage.outputs.forEach(function(output, i) {
                                if (output.satelliteName === l4.name) {
                                    l4.total = l4.total + 1;
                                } else if (output.satelliteName === l5.name) {
                                    l5.total = l5.total + 1;
                                } else if (output.satelliteName === l7.name) {
                                    l7.total = l7.total + 1;
                                }
                            })
                        });

                        totalImgBySatelitte.push(l4);
                        totalImgBySatelitte.push(l5);
                        totalImgBySatelitte.push(l7);

                        regionDetail.totalImgBySatelitte = totalImgBySatelitte;

                        responseRegions.data.forEach(function(region, index) {
                            if (regionDetail.regionName == region.regionName) {
                                region.regionDetail = regionDetail;
                            }
                        })
                    })
                }
                //console.log("responding: "+JSON.stringify(responseRegions.data))
                httpRes.status(responseRegions.code);
                httpRes.end(JSON.stringify(responseRegions.data));
            });
        } else {
            httpRes.status(responseRegions.code);
            httpRes.end(responseRegions.data);
        }

    }

    function handleGetRegionsDetailsResponse(response, httpReq, httpRes) {
        //httpRes.setHeader("Access-Control-Allow-Origin", "*");
        //console.log("responding: "+response.data)
        if (response.code == 200) {
            response.data.forEach(function(regionDetail, index) {

                var l4 = {
                    name: "L4",
                    total: 0
                };
                var l5 = {
                    name: "L5",
                    total: 0
                };
                var l7 = {
                    name: "L7",
                    total: 0
                };
                totalImgBySatelitte = [];

                regionDetail.processedImages.forEach(function(processedImage, ind) {
                    processedImage.outputs.forEach(function(output, i) {
                        if (output.satelliteName === l4.name) {
                            l4.total = l4.total + 1;
                        } else if (output.satelliteName === l5.name) {
                            l5.total = l5.total + 1;
                        } else if (output.satelliteName === l7.name) {
                            l7.total = l7.total + 1;
                        }
                    })

                });
                totalImgBySatelitte.push(l4);
                totalImgBySatelitte.push(l5);
                totalImgBySatelitte.push(l7);

                regionDetail.totalImgBySatelitte = totalImgBySatelitte;

            })
            httpRes.status(response.code);
            httpRes.end(JSON.stringify(response.data));
        } else {
            httpRes.status(response.code);
            httpRes.end(response.data);
        }

    }

    function handleSendEmailResponse(response, httpReq, httpRes) {
        //httpRes.setHeader("Access-Control-Allow-Origin", "*");
        console.log("POST EMAIL - responding: " + response.data)
        httpRes.status(response.code);
        httpRes.end(JSON.stringify(response.data));
    }

    //HELPER FUNCTIONS
    function extractUserInfo(req, res, next) {

        reqUserInfo.userEmail = req.headers[userEmailHeader];
        reqUserInfo.userPass = req.headers[userPassHeader];
        reqUserInfo.authToken = req.headers[tokenHeader];

        if (!reqUserInfo.userEmail ||
            !reqUserInfo.userPass) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(400);
            res.end("User credentials not informed");
        } else {
            next();
        }


    }
}

loadAppConfig();