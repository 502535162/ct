var express         = require('express')
var expressSession  = require('express-session');
var routes			= require('./config/routes');
var globals			= require('./config/global');
var sql				= require('./config/sql');


var app = express();
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

routes(app);