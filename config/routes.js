// var routeHandler 	= require('../controller/routeHandler');
// var util			= require('../model/util').util; 
var globals			= require('./global');
var bodyParser      = require("body-parser");
var sql		        = require("./sql");
var util			= require('../model/util').util; 
var routeHandler 	= require('../controller/routeHandler');
module.exports = function(app, express){
	"use strict";

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	app.listen(globals.appConfig.port);   
	console.log('Server Started on '+globals.appConfig.port);

	var utils 		= new util(sql);

	routeHandler(app, utils);
}