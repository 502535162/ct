var jwt    		= require('jsonwebtoken');
var globals		= require('../config/global');
var base64 		= require('base-64');
var utf8 		= require('utf8');

function util(sql){

	this.createuser = function(data, callback)
	{
		data.password = base64.encode(utf8.encode(data.password));
		var query = sql.connection.query('INSERT INTO userinfo SET ?', data, function(err, result) {
		  	// Neat!
		  	callback(err, result);
		});
		console.log(query.sql);
	}

	this.saveToken = function(){
	}

	this.getUserData = function(data, callback){
		var query = sql.connection.query('SELECT * FROM userinfo WHERE email=?', data.email, function(err, result) {
		  	// Neat!
		  	if(result.length > 0){
		  		result[0].password = base64.decode(result[0].password);
		  		callback(err, result[0]);
		  	}else{
		  		callback(err, null);
		  	}
		});
	}

	this.getpackages = function(sqlquery, callback){
		var query = sql.connection.query(sqlquery, function(err, result) {
		  	// Neat!
		  	if(err){
		  		callback(err, null);	
		  	}
		  	else if(result.length >= 0){
		  		callback(err, result);
		  	}
		});	
	}

	this.getpackageInfo = function(sqlquery, packageName, callback){
		var query = sql.connection.query(sqlquery, packageName, function(err, result) {
		  	// Neat!
		  	if(err){
		  		callback(err, null);	
		  	}
		  	else if(result.length >= 0){
		  		callback(err, result);
		  	}
		});	
	}

	this.getTestsandProfiles = function(sqlquery, callback){
		var query = sql.connection.query(sqlquery, function(err, result) {
		  	// Neat!
		  	if(err){
		  		callback(err, null);	
		  	}
		  	else if(result.length >= 0){
		  		callback(err, result);
		  	}
		});	
	}

	this.verifyToken = function(token, callback){
		if (token) {
    		jwt.verify(token, globals.secret, function(err, decoded) {      
	      		if (err) {
	        		callback({ success: false, message: 'Failed to authenticate token.' })
	      		} 
	      		else {
	        		callback({ decoded:decoded, success: true})
	      		}
    		});
  		} else {
    		callback({ success: false, message: 'No token provided.' });
  		}
	}
}

module.exports.util = util;