// $(function(){
// 	$.when(
// 		console.log("Loading Angular scripts...")
// 		$.getScript("//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js"),
// 		$.getScript("//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-route.js"),
// 		$.getScript("//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-sanitize.js")
// 	).done(function(){
// 		console.log("Angular scripts loaded");
// 	    $.when(
// 	    	$.getScript("vendor/angular/angular-resource.min.js"),
// 			$.getScript("/lang/lang_loader.js"),
// 			$.getScript("/dashboardApp.js"),
// 			$.getScript("/controllers/dashboardControllers.js"),
// 			$.getScript("/services/dashboardServices.js")
// 		).done(function(){
// 		    console.log("Application scripts loaded");
// 		});
// 	});
// });

var scripts = [
	"//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js", 
	"//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-route.js",
	"//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular-sanitize.js",
	"vendor/angular/angular-resource.min.js",
	"/lang/lang_loader.js",
	"/dashboardApp.js",
	"/controllers/dashboardControllers.js",
	"/services/dashboardServices.js"
]
var next = 0;

function loadScript(script){
	console.log('Loading '+script)
	$.when(
		$.getScript(script)
	).done(function( scriptLoaded, textStatus ) {
	    if(scripts.length > next){
	    	loadScript(scripts[next++])
	    }else{
	    	console.log("Application scripts loaded");
	    }
	})	
}

loadScript(scripts[next++]);
