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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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
	// logger.info("hit \'move\'");
	requestBodyHandler(contracts.move, req, res, 
		function (req, res) {
			endpoints.move( req.body, (response) => res.send(response))
		});
});

app.get('/getGameState', jsonParser, function (req, res) {
	// logger.info("hit \'getGameState\'");
	requestBodyHandler(contracts.getGameState, req, res, 
		function (req, res) {
			endpoints.getGameState( (response) => res.send(response))
		});
});

app.get('/clearGameState', jsonParser, function (req, res) {
	logger.info("hit \'clearGameState\'");
	requestBodyHandler(contracts.clearGameState, req, res, 
		function (req, res) {
			endpoints.clearGameState( (response) => res.send(response))
		});
});




// specify path for our static content
app.use(express.static(path.join(__dirname, env.path_to_dist)));

// endpoint for static stuff.
app.get('*', (req, res) => {
	logger.info("hit \'%s\'", req.originalUrl);
	res.sendFile(path.join(__dirname, env.path_to_dist+'/index.html'));
});



app.listen(port, () => logger.info('Game Server listening on port #%d...', port))
