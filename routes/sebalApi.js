var express = require('express');
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var router = express.Router();

api = {
  'SebalApi': function(sebalConfig) {
    var host = sebalConfig.host;
    var port = sebalConfig.port;
    var getImagesEndpoint = sebalConfig.getImagesEndpoint;

    return {
      authenticate: function(userInfo, callbackFunction) {

      },
      createUser: function(userInfo, callbackFunction) {

      },
      getImages: function(userInfo, callbackFunction) {
        var response = {
          'resp': undefined,
          'status': undefined,
          'code': undefined,
          'data': ''
        } var headers = {
          'Access-Control-Allow-Origin': '*',
          'userEmail': userInfo.userEmail,
          'userPass': userInfo.userPass
        }

        var options = {
          host: host,
          port: port,
          path: getImagesEndpoint,
          method: 'GET',
          headers: headers
        };

        http.request(options, function(res) {
              // res.setEncoding('utf8');
              res.on('data', function(data) {
                response.resp = res;
                response.status = 'SUCCESS'
                response.code = 200;
                response.data = response.data + data;
              });
              res.on('erro', function(erro) {
                console.log(JSON.stringify(erro))
                response.status = 'ERROR'
                response.code = 500;
                response.data = data
              });
              res.on('end', function() {
                response.data = JSON.parse(response.data);
                callbackFunction(response)
              })
            }).end();
      },
      getImage: function(imageId) {

      },
      getRegions: function(userInfo, callbackFunction) {
        var response = {
          'resp': undefined,
          'status': undefined,
          'code': undefined,
          'data': ''
        } fs
                           .readFile(
                               __dirname + '/saps_files/regions.json', 'utf8',
                               function(err, data) {
                                 if (err) {
                                   console.log(err)
                                   response.status = 'ERROR'
                                   response.code = 500;
                                   response.data = err
                                 } else {
                                   response.status = 'SUCCESS'
                                   response.code = 200;
                                   response.data = JSON.parse(data)
                                 }
                                 callbackFunction(response);
                               });
      }
    };
  }
} module.exports = api;

// var startApi = function(){

// 	console.log("Starting Sebal api");

// 	var api = {
// 		getImages: function(userInfo, callbackFunction){

// 			var response = {
// 				"resp": undefined,
// 				"status" : undefined,
// 				"code" : undefined,
// 				"data" : ""
// 			}
// 			var headers = {
// 				'Access-Control-Allow-Origin' :'*',
// 				'userEmail': userInfo.userEmail,
// 				'userPass': userInfo.userPass
// 			}

// 			var options = {
// 			  host: "localhost",
// 			  port: 9192,
// 			  path: '/images',
// 			  method: 'GET',
// 			  headers: headers
// 			};

// 			http.request(options, function(res) {
// 			  //res.setEncoding('utf8');
// 			  res.on('data', function (data) {
// 			  	response.resp = res;
// 			  	response.status = "SUCCESS"
// 				response.code = 200;
// 				response.data = response.data+data;
// 			  });
// 			  res.on('erro', function (erro) {
// 			  	console.log(JSON.stringify(erro))
// 			    response.status = "ERROR"
// 				response.code = 500;
// 				response.data = data
// 			  });
// 			  res.on("end", function(){

// 			  	response.data = JSON.parse(response.data);
// 				callbackFunction(response)
// 			  })
// 			}).end();
// 		},
// 		getImage: function(imageId){

// 		},
// 		getRegions: function(imageId){

// 		}
// 	};

// 	console.log("Returning api: "+JSON.stringify(api));

// }