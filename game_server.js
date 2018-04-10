var express = 			require('express');
var bodyParser = 		require('body-parser');
var path = 				require('path'); // for serving static content
var logger = 			require('winston');
var contracts = 		require('./contracts');
var endpoints = 		require('./endpoints');
var env = 				require('./environment');
var app = express();
var jsonParser = bodyParser.json({"type":"application/json"});
var port = env.port;

logger.exitOnError = false;

// allow certain headers
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Connection");
	// logger.info("Connection for %d - %s", req.get('Authorization'), req.get('Connection'));
	// if ("close" == req.get('Connection')) {
		// endpoints.deletePlayer(req.get('Authorization')); // TODO: put u_id in Auth Header, front & backend
	// }
	next();
});

requestBodyHandler = function(contract, req, res, callback) {
	if (!req.body) {
			return res.sendStatus(400);
	}
	else {
		contracts.enforce(req, contract, function(err, err_obj, req) {
			if (err) {
				// logger.warn("bodyHandler, error: ", err_obj.data);
				res.send(err_obj);
			}
			else {
				// logger.info("bodyHandler, OK.")
				callback(req, res);
			}
		});
	}
}

/* Endpoints:
	- joinGame
	- move
	- getState
*/
app.post('/joinGame', jsonParser, function (req, res) {
	logger.info("hit \'joinGame\'");
	requestBodyHandler(contracts.joinGame, req, res, 
		function (req, res) {
			// TODO - put user id in the Auth header.
			endpoints.joinGame( req.body, (response) => res.send(response))
		});
});

app.post('/move', jsonParser, function (req, res) {
	logger.info("Connection for %d - %s", req.get('Authorization'), req.get('Connection'));
	// logger.info("hit \'move\'");
	requestBodyHandler(contracts.move, req, res, 
		function (req, res) {
			// endpoints.move( req.body, (response) => res.send(response))
			endpoints.move( req.body, (response) => logger.verbose("move.response: ", response));
			res.send({'data':"MOVE: touch-&-go complete.", 'status':"success"});
		});
});

app.get('/getGameState', jsonParser, function (req, res) {
	// TODO: try to speed this up?
	endpoints.getGameState( (response) => res.send(response));
	
	// logger.info("hit \'getGameState\'");
	/*
	requestBodyHandler(contracts.getGameState, req, res, 
		function (req, res) {
			endpoints.getGameState( (response) => res.send(response))
		});
	*/
});

app.get('/clearGameState', jsonParser, function (req, res) {
	logger.info("hit \'clearGameState\'");
	requestBodyHandler(contracts.clearGameState, req, res, 
		function (req, res) {
			endpoints.clearGameState( (response) => res.send(response))
		});
});

app.post('/giveFlag', jsonParser, function (req, res) {
	logger.info("hit \'giveFlag\'");
	requestBodyHandler(contracts.giveFlag, req, res, 
		function (req, res) {
			endpoints.giveFlag( req.body, (response) => logger.info("giveFlag.response: ", response));
			res.send({'data':"giveFlag: touch-&-go complete.", 'status':"success"});
		});
});


// specify path for our static content
app.use(express.static(path.join(__dirname, env.path_to_dist)));

// endpoint for static stuff.
app.get('*', (req, res) => {
	// logger.info("hit \'%s\'", req.originalUrl);
	// logger.info("Connection for %d - %s", req.get('Authorization'), req.get('Connection'));
	res.sendFile(path.join(__dirname, env.path_to_dist+'/index.html'));
});



app.listen(port, () => logger.info('Game Server listening on port #%d...', port))
