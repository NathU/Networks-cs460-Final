var vars = {
	'speed' : 2.0,
	'friction' : 0.95, // a multiplier on speedX & speedY. must be < 1
	'url' : "http://localhost:3001/",
	'game_width' : 1000,
	'game_height' : 540,
	'refresh_interval' : 20, //(1000 / 50) /* 50 FPS */
	'req_rate' : 5 /* 25 = 2/sec, 10 = 5/sec, 5 = 10/sec, 2 = 25/sec */
	// 'coasting_threshold' : 0.019,
	// 'bounce' : -1.03,
};

var xhr;
var myScore;
var myPosition;
var you; // literally just the word "you" that follows you around as you move

var players = {}; // maps "name" : index# in 'players_array', below.
var players_array = []; // contains the actual component objects (the stuff that's drawn on the canvas)

// THIS player's info. Just for ease of reference.
var player = {
	'name' : "default",
	'id' : -1,
	'has_flag': 0, // put this in the component
	'index' : 0,
	'is_moving' : false
};


function nukeAndBuildScoreboard() {
	document.getElementById("scoreboard").deleteRow(0);
	var table = document.getElementById("scoreboard");
	var row = table.insertRow(0);
	row.id = "temp_row";
}

function addPlayerToScoreboard(name, score) {
	var row = document.getElementById("temp_row");
	var cell = row.insertCell(0);
	cell.innerHTML = name+"</br>"+String(score);
}


function send_request(req_type, endpoint, data) {
	var resp_data = {};
	var resp_status = "";
	xhr = new XMLHttpRequest();
	xhr.open(req_type/* POST or GET */, vars.url+endpoint, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Authorization", player.id);
	xhr.onreadystatechange = function () 
	{
		if (xhr.readyState === 4 && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			resp_status = response.status;

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

			else if (endpoint === "move" && resp_status === "success"){
			}
			else if (endpoint === "giveFlag" && resp_status === "success"){
			}

			else if (endpoint === "getGameState" && resp_status === "success"){
				resp_data = response.data;
				nukeAndBuildScoreboard();
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
						
						addPlayerToScoreboard(resp_data[i].name, resp_data[i].score);
					}
					// handle flag handoff.
					if (resp_data[i].has_flag > 0){
						players_array[players[resp_data[i].name]].color = "yellow";
						players_array[players[resp_data[i].name]].has_flag = true;
						if (resp_data[i].name === player.name)
							player.has_flag = true;
					}
					else if (resp_data[i].name === player.name){
						players_array[player.index].color = "blue";
						players_array[player.index].has_flag = false;
						player.has_flag = false;
					}
					else{
						players_array[players[resp_data[i].name]].color = "red";
						players_array[players[resp_data[i].name]].has_flag = false;
					}
				}
			}

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

function leaveGame() {
	xhr = new XMLHttpRequest();
	xhr.open("GET", vars.url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Authorization", player.id);
	xhr.setRequestHeader("Connection", "close"); // looks like this isn't allowed
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			console.log("You ("+player.name+") have left the game.")
		}
	}
	xhr.send();
}

function joinGame(player_name) { 
	x = Math.floor(Math.random() * (vars.game_width - 31));
	y = Math.floor(Math.random() * (vars.game_height - 31));
	send_request("POST", "joinGame", 
		{
			'name':String(player_name),
			'x_start': x,
			'y_start': y
		}); 
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
		document.body.insertBefore(this.canvas, document.body.childNodes[3]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, vars.refresh_interval);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

// component = anything that's drawn on the canvas.
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
	}
	this.next_y = function(){
		temp = Math.floor(this.y + this.speedY) % vars.game_height;
		if (temp < 0)
			temp += vars.game_height;
		return temp;
	}
	this.movement = function(){
		temp_x = Math.floor(this.x + this.speedX) % vars.game_width;
		temp_y = Math.floor(this.y + this.speedY) % vars.game_height;
		if (temp_x < 0)
			temp_x += vars.game_width;
		if (temp_y < 0)
			temp_y += vars.game_height;
		
		if (temp_x === this.x && temp_y === this.y)
			return null;
		else {
			return {
				'name': player.name,
				'x' : temp_x,
				'y' : temp_y,
				'score' : players_array[player.index].score 
			};
		}
	}
	this.newPos = function(x, y) {
		this.x = x;
		this.y = y;
	}
	this.crashWith = function(otherobj) {
		return !(((this.y + (this.height)) < otherobj.y) || 
					( this.y > (otherobj.y + (otherobj.height))) || 
					((this.x + (this.width)) < otherobj.x) || 
					( this.x > (otherobj.x + (otherobj.width))));
		/*
		var crash = true;
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
			crash = false;
		}
		else {
			console.log("collision!");
		}
		return crash;
		*/
	}
}

function updateGameArea() {	 
	players_array[player.index].speedX *= vars.friction;
	players_array[player.index].speedY *= vars.friction;
	if (myGameArea.frameNo % 12.5 == 0) {
		// check for flag hand-offs. Only check when you're carrying the flag.
		// use our local version of has_flag so you don't call "giveFlag" multiple times.
		// in other words, update game state, and assume you don't have the flag until you get the new game state.
		if (player.has_flag/*players_array[player.index].has_flag*/) {
			for (i = 0; i < players_array.length; i += 1) {
				if ( !(i === player.index) && players_array[player.index].crashWith(players_array[i]) ) {
					player.has_flag = false;
					console.log("You bumped into "+players_array[i].name);
					send_request("POST", "giveFlag", {'name':players_array[i].name});
					break;
				}
			}
		}
	}
	
	if (myGameArea.frameNo % vars.req_rate == 0) {
		// Only send a "move" request if we're really moving.
		let data = null;
		if (data = players_array[player.index].movement()) {
			send_request("POST", "move", data);
			console.log("moved");
		} else {
			console.log("didn't move");
		}
		send_request("GET", "getGameState", null);
	}

	myGameArea.clear();
	myGameArea.frameNo += 1;

	// Update other stuff that's drawn
	if ( !(players[player.name] === undefined) ) {
		myPosition.text="("+String(players_array[player.index].x)+", "+String(players_array[player.index].y)+")";
		
		you.x = players_array[player.index].x;
		you.y = players_array[player.index].y;
		
		if (players_array[player.index].has_flag)
			players_array[player.index].score += 1;
		
		myScore.text="Score: "+ String(players_array[player.index].score);
	}
	you.update();
	myScore.update();
	myPosition.update();
	
	// actually draw the updates for all players
	for (i = 0; i < players_array.length; i += 1)
		players_array[i].update();
}

function everyinterval(n) {
	if ((myGameArea.frameNo / n) % 1 == 0) 
		return true;
	return false;
}

function accelerate_me(delta_x, delta_y) {
	players_array[player.index].speedX += delta_x;
	players_array[player.index].speedY += delta_y;
}

function getKeyPress(event) {
	if (player.id > -1){
		// player.is_moving = true;
		/* 
		In this example, we use a cross-browser solution, because the keyCode property does not 
		work on the onkeypress event in Firefox. However, the which property does.
		Explanation of the first line in the function below: if the browser supports event.which, 
		then use event.which, otherwise use event.keyCode 
		*/
		var key = event.which || event.keyCode;
		// Player 1 (wasd)
		if (key == 97 /*a - Left */) {
			accelerate_me(vars.speed * -1, 0);
		}
		else if (key == 100 /*d - Right*/) {
			accelerate_me(vars.speed, 0);
		}
		else if (key == 119 /*w - Up */) {
			accelerate_me(0, vars.speed * -1);
		}
		else if (key == 115 /*s - Down*/) {
			accelerate_me(0, vars.speed);
		}
	}

}










