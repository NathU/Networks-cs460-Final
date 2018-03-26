var logger = require('winston');

exports.enforce = function(req, contract, callback){
	
	var resp_obj = { 
		'err' : false,
		'data' : []
	};
	
	var example = {};
	
	for (key in contract) {
		example[key] = contract[key].type;
		
		// catch missing required fields
		if (req.body[key] === undefined) {
			if (contract[key].required) {
				// missing required field!
				resp_obj.err = true;
				resp_obj.data.push({'msg':"missing required field", example});
			}
			else {
				// create non-required field and assign it placeholder value of NULL
				req.body[key] = null;
			}
		}
		else {
			if (contract[key].required && req.body[key] === null) {
				// required field is NULL!
				resp_obj.err = true;
				resp_obj.data.push({'msg':"required field is NULL", example});
			}
			else if ( (typeof req.body[key] != typeof contract[key].type) && !(req.body[key] === null) ) {
				// wrong type!
				resp_obj.err = true;
				resp_obj.data.push({'msg':"wrong field type", example});
			}
			// else, we're okay.
		}
		
		example = {};
	}
	
	if (resp_obj.err)
		logger.warn("enforceContract: %s req body: ",(resp_obj.err ? "BAD" : "GOOD") ,req.body);
	callback(resp_obj.err, resp_obj, req);
	
}


exports.joinGame = {
	'name':{
		'required':true,
		'type':"string"
	}
};
exports.move = {
	'id':{
		'required':true,
		'type':5
	},
	'x':{
		'required':true,
		'type':5
	},
	'y':{
		'required':true,
		'type':5		
	},
	'move_type':{
		'required':false,
		'type':"string"		
	}
};
exports.getGameState = {};
exports.clearGameState = {};

exports.DB_Access_Error = { 'data':"DB error. This is a problem.", 'status':"failure" };
exports.No_Players_Error = {'data': "There appear to be ZERO players", 'status': "failure"}
exports.Move_Failure = {'data': "Failed to update your position in the Game Model", 'status': "failure"}