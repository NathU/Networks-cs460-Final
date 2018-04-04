var db = require("./dbService");
var contracts = require('./contracts');
var logger = require('winston');


exports.giveFlag = function( req_body, callback){
	db.query("CALL giveFlag(?)", 
		[req_body.name],
		function(err, qr){
			if(err) {
				logger.error("giveFlag: giveFlag(sql): ", err);
				callback(contracts.DB_Access_Error);
			}
			else {
				if (qr.affectedRows < 1) {
					logger.warn("giveFlag: Failure! could not give the flag to %s!", req_body.name);
					callback(contracts.GIVEFlag_Failure);
				}
				else {
					logger.info("giveFlag: gave flag to %s.", req_body.name);
					callback( {'data': req_body.name+" got the flag!", 'status': "success"} );
				}
			}
	});
}


exports.clearGameState = function( callback){
	db.query("CALL clearGameState(?)", 
		[0],
		function(err, qr){
			if(err) {
				logger.error("clearGameState: clearGameState (sql): ", err);
				callback(contracts.DB_Access_Error);
			}
			else {
				if (qr.affectedRows < 1) {
					logger.warn("clearGameState: There appear to be ZERO players");
					callback( contracts.No_Players_Error );
				}
				else {
					logger.info("clearGameState: success.");
					callback( {'data': "they\'re... all... DEAD!!!", 'status': "success"} );
				}
			}
	});
}


exports.getGameState = function( callback){
	db.query("CALL getGameState(?)", 
		[0],
		function(err, qr){
			if(err) {
				logger.error("getGameState: getGameState (sql): ", err);
				callback(contracts.DB_Access_Error);
			}
			else {
				if (qr[0].length == 0) {
					logger.warn("getGameState: There appear to be ZERO players");
					callback( contracts.No_Players_Error );
				}
				else {
					// logger.info("getGameState: success.");
					callback( {'data': qr[0], 'status': "success"} );
				}
			}
	});
}


exports.move = function( req_body, callback){
	db.query("CALL updatePosition(?,?,?,?)", 
		[req_body.name, req_body.x, req_body.y, req_body.score],
		function(err, qr){
			if(err) {
				logger.error("move: updatePosition(sql): ", err);
				callback(contracts.DB_Access_Error);
			}
			else {
				if (qr.affectedRows < 1) {
					logger.warn("move: could not update position for user %s", req_body.name);
					callback(contracts.Move_Failure);
				}
				else {
					// logger.info("move: success.");
					callback( {'data': {'x':req_body.x, 'y':req_body.y }, 'status': "success"} );
				}
			}
	});
}


// exports.collision = function( req_body, callback){
	// db.query("CALL updatePosition(?,?,?,?)", 
		// [req_body.name, req_body.x, req_body.y, req_body.score],
		// function(err, qr){
			// if(err) {
				// logger.error("collision: updatePosition(sql): ", err);
				// callback(contracts.DB_Access_Error);
			// }
			// else {
				// if (qr.affectedRows < 1) {
					// logger.warn("collision: could not update position for user %s", req_body.name);
					// callback(contracts.Move_Failure);
				// }
				// else {
					// logger.info("collision: success.");
					// callback( {'data': {'x':req_body.x, 'y':req_body.y }, 'status': "success"} );
				// }
			// }
	// });
// }


exports.joinGame = function(req_body, callback){
	db.query("CALL addPlayer(?,?,?)", 
		[req_body.name, req_body.x_start, req_body.y_start], 
		function(err, qr){
			if(err) {
				logger.error("joinGame: addPlayer(sql): ", err);
				callback(contracts.DB_Access_Error);//callback("Internal Error... ");//callback(true, contracts.DB_Access_Error, null);
			}
			else {
				if (qr[0].length == 0) {
					logger.warn("joinGame: user name \'%s\' already in use", req_body.name);
					callback("That name is taken. Try a different one. Must be < 32 characters.");
				}
				else {
					logger.info("joinGame: %s has joined the game!", req_body.name);
					callback( {'data': qr[0] /*{'name':req_body.name}*/, 'status': "success"} );
				}
			}
		});
}

