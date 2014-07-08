var debug = require('debug')('requester-dbutils');

var evn_param_getter = require('./cloud_env_params');
var env_fallback = { 
	"services":{
		"mysql-5.5": [
			{
				"name": "localhost",
				"credentials": {
					"name": "requester_db",
					"host": "localhost",
					"port": "3306",
					"username":"root",
					"password":"root"
				}
			}
		]
	}
};
var env_params = evn_param_getter(env_fallback);
// using first db
var db_conn_params = env_params["services"]["mysql-5.5"][0];
var db_conn_cred = db_conn_params["credentials"];

var mysql = require('mysql');
var option = {
	host:     db_conn_cred.host,
	port:     db_conn_cred.port,
	user:     db_conn_cred.username,
	password:  db_conn_cred.password,
	database: db_conn_cred.name
};
var pool = mysql.createPool(option);

function query(sql, values, callback){

	pool.getConnection(function(err, connection) {

		if(err) throw err;


		if(values instanceof Function){
			callback = values;
			values = undefined;
		}


		var preparedSql = mysql.format(sql, values);
		debug(preparedSql);

		// connection.query(preparedSql, function(err, result){
		connection.query(sql, values, function(err, result){

			if(callback) {

				callback(err, result, function done(){
					/*please call done() after finish*/
					connection.release();
				});

			} else {

				if(err) throw err;
				connection.release();

			}
		});
	});

}

function batch(sqls){

	pool.getConnection(function(err, connection) {
		
		for(var s in sqls){

			var sql = sqls[s];
			connection.query(sql);

		}

		connection.release();
	});
}

exports.query = query;
exports.batch = batch;
