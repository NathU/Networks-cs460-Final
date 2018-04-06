var vars = {
	'bounce' : -1.03,
	'friction' : 0.9,
	'url' : "http://localhost:3001/",//"https://www.joyfulnetworking.com/",//"http://10.35.162.176:3001/",//
	'game_width' : 1200,
	'game_height' : 540,
	'refresh_interval' : 20 // (1000 / 50 /* <- FPS */)
};

var xhr;
var myScore;
var myPosition;
var players = {}; // maps "name" : index# in 'players_array'
var players_array = [];
// THIS player's info.
var player = {
	'name' : "default",
	'id' : -1,
	'has_flag': 0, // put this in the component
	'index' : 0
};

function send_request(req_type, endpoint, data) {
	var resp_data = {};
	var resp_status = "";
	xhr = new XMLHttpRequest();
	xhr.open(req_type/* POST or GET */, vars.url + endpoint, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			resp_status = response.status;
			// Player joins the game.
			if (endpoint === "joinGame"){
				resp_data = response.data[0];
				if (resp_status === "failure") {
					console.log("That name is taken. Please pick a different name.");
					return;
				}
				else {
					player.name = resp_data.name;
					player.id = resp_data.id;
					players_array.push(new component(player.name, 30, 30, "red", resp_data.x_pos, resp_data.y_pos));
					players[resp_data.name] = players_array.length - 1;
					player.index = players[resp_data.name];
					console.log(player.name + "("+player.id+") has joined the game!");
					startGame();
				}
			}
			// Player moves.
			else if (endpoint === "move" && resp_status === "success"){
			}
			// Player loses the flag.
			else if (endpoint === "giveFlag" && resp_status === "success"){
			}
			// Player refreshes the game state.
			else if (endpoint === "getGameState" && resp_status === "success"){
				resp_data = response.data;
				for (i = 0; i < resp_data.length; i += 1) {
					// catch new players
					if (players[resp_data[i].name] === undefined) {
						players_array.push(new component(resp_data[i].name, 30, 30, "blue", resp_data[i].x_pos, resp_data[i].y_pos));
						players[resp_data[i].name] = players_array.length - 1;
						console.log(resp_data[i].name + "(i="+players[resp_data[i].name]+") has joined the game!");
					}
					// update existing players
					else {
						// update position
						players_array[players[resp_data[i].name]].newPos(resp_data[i].x_pos, resp_data[i].y_pos);
						// update score
						players_array[players[resp_data[i].name]].score = resp_data[i].score;
					}
					// handle flag handoff.
					if (resp_data[i].has_flag > 0){
						players_array[players[resp_data[i].name]].color = "yellow";
						players_array[players[resp_data[i].name]].has_flag = true;
					}
					else if (resp_data[i].name === player.name){
						players_array[player.index].color = "blue";
						players_array[player.index].has_flag = false;
					}
					else{
						players_array[players[resp_data[i].name]].color = "red";
						players_array[players[resp_data[i].name]].has_flag = false;
					}
				}
			}
			// Failure.
			else
				console.log("SEND_REQ: " + endpoint + "  " + JSON.stringify(data) + "FAILED.");
		}
	};
	if (!data) {
		xhr.send();
	}
	else {
		var req_body = JSON.stringify(data);
		xhr.send(req_body);
	}
}

function joinGame(player_name) { 
	x = Math.floor(Math.random() * (vars.game_width - 31));
	y = Math.floor(Math.random() * (vars.game_height - 31));
	send_request("POST", "joinGame", 
		{
			'name':String(player_name),
			'x_start': x,
			'y_start': y
		}
	); 
}

function startGame() {
	myScore = new component("score", "15px", "Consolas", "black", 20, 20, "text");
	myPosition = new component("position", "10px", "Consolas", "black", 20, 40, "text");
	you = new component("you", "13px", "Consolas", "black", players_array[player.index].x, players_array[player.index].y, "text");

	you.text = "you";
	myScore.text = "Score: ";
	myPosition.text = "(?, ?)";

	myGameArea.start();
}

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = vars.game_width;
		this.canvas.height = vars.game_height;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, vars.refresh_interval);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function component(name, width, height, color, x, y, type) {
	this.color = color;
	this.name = name;
	this.type = type;
	this.score = 0;
	this.has_flag = false;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;    
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	this.next_x = function(){
		temp = Math.floor(this.x + this.speedX) % vars.game_width;
		if (temp < 0)
			temp += vars.game_width;
		return temp;
		// return Math.abs(Math.floor(this.x + this.speedX)) % vars.game_width;
	}
	this.next_y = function(){
		temp = Math.floor(this.y + this.speedY) % vars.game_height;
		if (temp < 0)
			temp += vars.game_height;
		return temp;
		//return Math.abs(Math.floor(this.y + this.speedY)) % vars.game_height;
	}
	this.newPos = function(x, y) {
		this.x = x;
		this.y = y;
		this.speedX = this.speedX * vars.friction;
		this.speedY = this.speedY * vars.friction;
	}
	this.hitSide = function() {
		var hit = false;
		var myleft = this.x;
		var myright = this.x;// + (this.width);
		var mytop = this.y;
		var mybottom = this.y// + (this.height);
		var left_side = 0;
		var right_side = myGameArea.canvas.width - this.width;
		var top = 0;
		var bottom = myGameArea.canvas.height - this.height;

		return (mybottom >= bottom || mytop <= top || myright >= right_side || myleft <= left_side);
		/*
			if (mybottom >= bottom) {
				// this.speedY =  Math.abs(this.speedY) * -1 * vars.bounce;
				hit = true;
			}
			else if (mytop <= top ) {
				// this.speedY = Math.abs(this.speedY) * vars.bounce;
				hit = true;
			}
			if (myright >= right_side) {
				// this.speedX = Math.abs(this.speedX) * -1 * vars.bounce;
				hit = true;
			}
			else if (myleft <= left_side ) {
				// this.speedX = Math.abs(this.speedX) * vars.bounce;
				hit = true;
			}
			return hit;
		*/
	}
	this.crashWith = function(otherobj) {
		var crash = true;
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);

		if ( (mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright) ) {
			crash = false;
		}
		// if (myleft >= )
			// crash = false;

		else {
			// this.speedX = Math.abs(this.speedX) * -1 * vars.bounce;
			// this.speedY = Math.abs(this.speedY) * -1 * vars.bounce;
			console.log("collision!");
		}
		return crash;
	}
}

function updateGameArea() {
	/*
		// Check if you hit the side.
		if (players_array[players[player.name]].hitSide()) {
			console.log("bumped the wall."); // TODO: 
		}
	*/

	// loop thru other players in game to determine collisions
	for (i = 0; i < players_array.length; i += 1) {
		if ( 
			!(i === player.index) &&
			players_array[player.index].crashWith(players_array[i]) &&
			players_array[player.index].has_flag
		) {
			console.log("You bumped into "+players_array[i].name);
			// only call if you have the flag
			if (players_array[player.index].color == "yellow") {
				send_request("POST", "giveFlag", {'name':players_array[i].name});
			}
		}
	}

	// Update Moves 10 times per second
	if (myGameArea.frameNo % 5 == 0) {
		var data = {
			'name': player.name,
			'x' : players_array[player.index].next_x(),
			'y' : players_array[player.index].next_y(),
			'score' : players_array[player.index].score 
		};
		send_request("POST", "move", data);
		// send_request("GET", "getGameState", null);
	}

	// Get Game State 5 times per second
	if (myGameArea.frameNo % 10 == 0) {
		send_request("GET", "getGameState", null);
	} 
	 
	myGameArea.clear();
	myGameArea.frameNo += 1;
	 
	if ( !(players[player.name] === undefined) ) {
		myPosition.text = "(" + String(players_array[players[player.name]].x) + ", " + String(players_array[players[player.name]].y) + ")";
		you.x = players_array[player.index].x;
		you.y = players_array[player.index].y;
		if (players_array[player.index].has_flag) {
			players_array[player.index].score += 1;
		}
		myScore.text = "Score: " + String(players_array[player.index].score);
	}

	you.update();
	myScore.update();
	myPosition.update();	 
	for (i = 0; i < players_array.length; i += 1) {
		players_array[i].update();
	}
}

function everyinterval(n) {
	return ( (myGameArea.frameNo / n) % 1 == 0 );
}

function accelerate_me(x, y) {
	players_array[players[player.name]].speedX += x;
	players_array[players[player.name]].speedY += y;
}

function getKeyPress(event) {
	/* 
		In this example, we use a cross-browser solution, because the keyCode property does not 
			work on the onkeypress event in Firefox. However, the which property does.
		Explanation of the first line in the function below: if the browser supports event.which, 
			then use event.which, otherwise use event.keyCode 
	*/
	var key = event.which || event.keyCode;
	var speed = 0.9;
	// Player 1 (wasd)
	if (key == 97 /*a - Left */) {
		accelerate_me(speed * -1, 0);
	}
	else if (key == 100 /*d - Right*/) {
		accelerate_me(speed, 0);
	}
	else if (key == 119 /*w - Up */) {
		accelerate_me(0, speed * -1);
	}
	else if (key == 115 /*s - Down*/) {
		accelerate_me(0, speed);
	}
}
