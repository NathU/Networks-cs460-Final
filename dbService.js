var mysql = require('mysql');
var env = require('./environment');

var poolInfo = {connectionLimit:env.limit,
                host: env.host,
                user: env.user,
                password: env.password,
                database: env.database,
            };

var pool = mysql.createPool(poolInfo);

/*
* Parameters:
* - a string-encoded MySQL Stored Procedure with ?'s for it's parameters
* - an array of strings corresponding to the ?'s
* - your callback for handling the query response
* i.e.:
*		query("Call addAccount(?,?)", 
*				["Gerg soand so","proficiant and cool"], 
*				function(err, queryResult){
*					...
*				});
*/
exports.query = function(queryString, listOfInputs, callback){
	try{
		pool.getConnection(function(err, conn){
			if(err){
				callback("DB: could not secure a connection 2", null);
			}
			else{
				conn.query(queryString, listOfInputs, function(err, rows){
					conn.release();
					if(err) {
						console.log(JSON.stringify(err));
						console.log(err);
						callback("DB: could not complete query", null);
					}
					else
						callback(null, rows);
				});
			}
		});
	}
	catch(err){
		callback("DB: could not secure a connection 1", null);
	}
}
