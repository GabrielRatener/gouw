/* Gennerally useful methods for arrays */

//element wise array addition
Array.prototype.process = function(func){
	var rett = [];
	for (var i = 0; i < this.length; i++) {
		rett.push(func(this[i]));
	}

	return rett;
}

Array.prototype.contains2 = function(){

	for (var i = 0; i < this.length; i++) {
		for(var j = 0; j < arguments.length; j++){
			if(this[i] == arguments[j]) return true;		
		}
	}

	return false;
}

Array.prototype.contains = function(){

	for (var i = 0; i < this.length; i++) {
		for(var j = 0; j < arguments.length; j++){
			if(this[i] === arguments[j]) return true;				
		}
	}

	return false;
}

Array.prototype.clean = function(){
	var args = [];
	for (var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	var i = 0;
	while(i < this.length){
		if(args.contains(this[i])){
			this.splice(i, 1);
		}else i++;
	}
}

Array.prototype.histogram = function(){
	var obj = {};

	for (var i = 0; i < this.length; i++) {
		if(obj.hasOwnProperty(this[i])){
			obj[this[i]]++;
		}else{
			obj[this[i]] = 1;
		}
	}

	return obj;
}

// modules
var http = require('http'),
	url = require('url'),
	fsy = require('fs');
	socketio = require('socket.io');

// constructors
var Unique = require('./modules/unique'),
	Profile = require('./modules/profile'),
	ProfileList = require('./modules/profile_list'),
	ProfilePair = require('./modules/profile_pair');
	//Game = require('./modules/game/game');



//create new list and have it cleaned every minute
var ONLINE = new ProfileList();
ONLINE.clean(5000);

var REQUESTS = {};

var GAMES = {};

var uni = new Unique(10);







var app = http.createServer(function(req, res) {
	var pars = url.parse(req.url),
		file = pars.pathname.split("/");

	file.clean("");

	if(file[0] === "virtual"){

	}else{
		if(file.contains("~", "..", ".", "/")){
			res.writeHead(403);
			res.end('Access forbidden');
		}else{

			if(!file.length){
				console.log("hooplay");
				var pat = "public/index.html";
			}else{
				var pat = "public/" + file.join("/");
			}

			console.log(file);
			console.log(__dirname + "/" + pat);

			fsy.readFile(__dirname + "/" + pat, function (err, data) {
				if (err) {
					res.writeHead(500);
					res.end('Error loading: ' + pat);
				}else{
					res.writeHead(200);
					res.end(data);
				}
			});
		}
	}


	// more primitive server
	/*
	if(["", "/"].indexOf(path) >= 0) path = '/index.html';
	if(path.indexOf("..") < 0){
		fsy.readFile(__dirname + path, function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading: ' + path);
			}

			res.writeHead(200);
			res.end(data);
		});
	}else{
		res.writeHead(403);
		res.end('Access forbidden');
	}
	*/
}).listen(80);


var io = socketio.listen(app);
io.sockets.on('connection', function(socket){
	var profile = ONLINE.addSocket(socket);

	var name,
		next = ONLINE.iterator("name", "playing", "socket"),
		players = [];
	while(name = next()){
		if(name.socket !== socket.id) players.push(name);
	}

	var me = {
		"name": profile.getField("name"),
		"socket": profile.getField("socket")
	};

	profile.on('disconnect', function(){
		ONLINE.removeSocket(socket);
		ONLINE.send('take_player', me.socket);
	});

	profile.on('game_request', function(data){
		var toke = uni.token();
		REQUESTS[toke] = data;
		data.toke = toke;

		var targ = ONLINE.sid(data.target);
		targ.on('game_accept', function(udata){
			var pot = REQUESTS[udata.toke];
			if(pot.target === socket.id){
				delete REQUESTS[data.toke];
				targ.off('game_accept');



				/* Game Events */

				var game = GAMES[data.toke] = new Game(
						profile.uid,
						targ.uid, 
						data.parameters
					),

					// static so no cleaning necessary
					players = new ProfilePair(profile, targ);

				players.on('play', function(data, id){
					var play = game.play(data.point, id);


					players.send('play', play);
				});

				players.on('pass', function(id){
					var pass = game.pass(id);


					players.send('pass', pass);
				});

				players.on('resign', function(data, id){
					var resign = game.resign(id);


					players.send('resign', resign);
				});

				players.on('request_undo', function(id){

					var mee = players.byUid(id),
						opp = players.byNotUid(id);

					opp.on('accept_undo', function(id){
						opp.off('accept_undo');
						opp.off('decline_undo');

						var undo = game.undo(id);
						players.send('undo', undo);
					});

					opp.on('decline_undo', function(id){
						opp.off('accept_undo');
						opp.off('decline_undo', false);

						mee.send('undo', false);
					});


				});

				/////////////////
			}
		});
		targ.send('game_request', data);
	});


	profile.send('info', {
		"online": players,
		"me": me
	});

	ONLINE.send('add_player', me);

});

