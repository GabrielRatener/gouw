/* Gennerally useful methods for arrays */

// for debugging
var DEBUG_MODE = true;


function give(arg){
	return arg;
}

//Built in object extensions:
require("./modules/extend/array.js");

// modules
var http = require('http'),
	mime = require('mime'),
	url = require('url'),
	fsy = require('fs'),
	socketio = require('socket.io');

// constructors
var Unique = require('./modules/unique'),
	Profile = require('./modules/profile'),
	ProfileList = require('./modules/profile_list'),
	ProfilePair = require('./modules/profile_pair'),
	Game = require('./modules/game/game');

//create new list and have it cleaned every minute
var ONLINE = new ProfileList();
ONLINE.clean(5000);

var REQUESTS = {};

var GAMES = {};

var uni = new Unique(10);



// http server
// if debug mode is off only public/ is visible
var root = (DEBUG_MODE) ? "" : "public/";
var app = http.createServer(function(req, res) {
	var pars = url.parse(req.url),
		file = pars.pathname.split("/");

	file.clean("");

	if(file[0] === "q"){

	}else{
		if(file.contains("~", "..", ".", "/")){
			res.writeHead(403);
			res.end('Access forbidden\n');
		}else{

			if(!file.length){
				var pat = root + "index.html";
			}else{
				var pat = root + file.join("/");
			}

			fsy.readFile(__dirname + "/" + pat, function (err, data) {
				if (err) {
					res.writeHead(500);
					res.end('Error loading: ' + pat);
				}else{
					var mtype = mime.lookup(pat);
					res.writeHead(200, {
						"Content-Length": data.length,
						"Content-Type": mtype
					});
					res.end(data);
				}
			});
		}
	}
}).listen(80);


var io = socketio.listen(app, {log: false});
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

	socket.on('debug', function(code){
		var res = eval(code);
		socket.emit('debug_res', res);
	});

	profile.on('disconnect', function(){
		ONLINE.removeSocket(socket);
		ONLINE.send('take_player', me.socket);
	});

	profile.on('game_request', function(data){
		var toke = uni.token();
		REQUESTS[toke] = data;
		data.toke = toke;

		var targ = ONLINE.bid(data.target);
		targ.on('game_accept', function(udata){
			var pot = REQUESTS[udata.toke];
			if(pot.target === targ.uid){
				delete REQUESTS[data.toke];
				targ.off('game_accept');



				/* Game Events

				var game = GAMES[data.toke] = new Game(
						profile.uid,
						targ.uid, 
						data.parameters
					),

					// static so no cleaning necessary

				*/
				var players = new ProfilePair(targ, profile),
					game = new Game([targ.uid, profile.uid], {});

				players.on('play', function(data, id){
					var play = game.play(data.point, id);
					if(play) players.send('game_update', {
						"type": "play",
						"color": play.color,
						"point": play.played[0],
						"captures": play.captured,
						"turn": play.turn
					});
					else players.send('error', data);
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

				profile.send('new_game', {
					"size": [19, 19],
					"color": 1
				});

				targ.send('new_game', {
					"size": [19, 19],
					"color": 0
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