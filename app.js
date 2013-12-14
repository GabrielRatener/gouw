/* Gennerally useful methods for arrays */

//element wise array addition
Array.prototype.process = function(func){
	var rett = [];
	for (var i = 0; i < this.length; i++) {
		rett.push(func(this[i]));
	}

	return rett;
}

Array.prototype.contains = function(val, strict){
	if(strict){
		for (var i = 0; i < this.length; i++) {
			if(this[i] === val) return true;
		}
	}else{
		for (var i = 0; i < this.length; i++) {
			if(this[i] == val) return true;
		}
	}

	return false;
}

Array.prototype.clean = function(){
	var args = [];
	for (var i = 0; i < arguments.le)ngth; i++) {
		args.push(arguments[i]);
	}

	var i = 0;
	while(i < this.length){
		if(this[i] in args){
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
	ProfilePair = require('./modules/profile_pair'),
	Game = require('./modules/game/game');


var Names = (function(){
	var me = {};

	var NOUNS = [
		"noodle",
		"centrifuge",
		"home",
		"store",
		"war",
		"cold",
		"system",
		"book",
		"trick",
		"airplane",
		"jet",
		"isentrope",
		"volcano",
		"shirt",
		"whisper",
		"gradient",
		"slope",
		"whale",
		"cloud",
		"potato",
		"cyclone",
		"layer",
		"surface",
		"blimp",
		"helicopter",
		"zebra",
		"nautilus",
		"smoothie",
		"tornado",
		"phone",
		"equation",
		"drug",
		"race",
		"crest",
		"planet",
		"orbit",
		"star",
		"emission",
		"typo",
		"glow",
		"storm",
		"soap",
		"strawberry",
		"guava",
		"fig",
		"ficus",
		"stone",
		"door",
		"crab",
		"clam",
		"lamp",
		"spider",
		"viper",
		"chicken"
	];

	var ADJECTIVES = [
		"wasteful",
		"distasteful",
		"barotropic",
		"volcanic",
		"isotropic",
		"windy",
		"long",
		"juicy",
		"slender",
		"spicy",
		"sweet",
		"slimy",
		"snowy",
		"humid",
		"african",
		"american",
		"opaque",
		"transparent",
		"happy",
		"ethical",
		"unethical",
		"chewy",
		"sleek",
		"bright",
		"dull",
		"alternate",
		"grueling",
		"fierce",
		"tropical",
		"subtropical",
		"polar",
		"incorrect",
		"awesome",
		"intense",
		"curvy",
		"coy",
		"brave",
		"delightful",
		"insightful",
		"intellectual",
		"anonymous",
		"crazy",
		"drastic",
		"legal",
		"liquid",
		"icy",
		"grumpy",
		"brute",
		"peachy",
		"scarce",
		"frozen",
		"happy"
	];

	var stash = (function(){
		var me = {};

		var reserved = [];

		me.reserve = function(name){
			if(name in reserved){
				return false;
			}else{
				reserved.push(name);
				return true;
			}
		}

		me.taken = function(name){
			return (name in reserved);
		}

		me.free = function(name){
			if(name in reserved){
				return false;
			}else{
				var index = reserved.indexOf(name);
				reserved.splice(index, 1);
				return true;
			}
		}

		return me;
	}());

	function randomNoun(){
		var index = Math.floor(NOUNS.length * Math.random());
		return NOUNS[index];
	}

	function randomAdjective(){
		var index = Math.floor(ADJECTIVES.length * Math.random());
		return ADJECTIVES[index];
	}

	me.uniqueName = function(){
		do{
			var same = Math.floor(2 * Math.random());
			if(same){
				var n1 = randomNoun();
				do{
					var n2 = randomNoun();
				}while(n1 === n2);
			}else{
				var n1 = randomAdjective(),
					n2 = randomNoun();
			}

			var name = n1 + " " + n2;
		}while(stash.taken(name));

		stash.reserve(name);
		return name;
	}

	me.freeName = function(name){
		stash.free(name);
	}

	return me;
}());

//create new list and have it cleaned every minute
var ONLINE = new ProfileList();
ONLINE.cleanList(60000);

var REQUESTS = {};

var GAMES = {};

var uni = new Unique(10);






var GameSocketHandler = (function(){
	var me = {};

	me.listen = function(profile, game){
		profile.on('play', function(data){
			var playerID = profile.getField('socket');
			var out = game.play(playerID, data.point);
		});

		profile.on('pass', function(data){

		});

		profile.on('resign', function(data){

		});
	}

	me.stopListen = function(profile){

	}

	return me;
}());

var app = http.createServer(function(req, res) {
	var pars = url.parse(req.url),
		path = pars.pathname;

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
		return res.end('Access forbidden');
	}
}).listen(80);
var io = socketio.listen(app);


io.sockets.on('connection', function(socket){
	var profile = ONLINE.addSocket(socket);
	profile.

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

	profile.send('info', {
		"online": players,
		"me": me
	});

	ONLINE.send('add_player', me);

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
				});

				players.on('pass', function(id){
					var pass = game.pass(id);
				});

				players.on('resign', function(data, id){
					var resign = game.resign(id);
				});

				players.on('request_undo', function(id){

					var opp = players.byNotUid(id);
					opp.on('accept_undo', function(id){
						opp.off('accept_undo', 'decline_undo');

						var undo = game.undo(id);
					});

					opp.on('decline_undo', function(id){
						opp.off('accept_undo', 'decline_undo');
					});
				});

				/////////////////
			}
		});
		targ.send('game_request', data);
	});
});

