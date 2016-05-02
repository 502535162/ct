var sql = require('mysql');

var connection = sql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database: "checkthat"
});

connection.connect(function(err){
	if(err){
		console.log('Error connecting to Db');
		return;
	}
	console.log('Connection established');
});

module.exports.connection = connection;