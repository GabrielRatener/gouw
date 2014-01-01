require('../extend/object.js');
require('../extend/array.js');

var Empty = require('./empty.js'),
	Stone = require('./stone.js'),
	Unique = require('../unique.js');

function adda(){
	var lead = arguments[0], arr = [];
	for (var i = 0; i < lead.length; i++) {
		var sum = 0;
		for(var j = 0; j < arguments.length; j++){
			sum += arguments[j][i];
		}

		arr.push(sum);
	}

	return arr;
}

function Game(players, options){
	// players[0]: black, players[1]: white
	this._players = players;

	// default values
	var opts = {
		"width": 19,
		"height": 19,
		"handicap": 0,
		"initial": [[],[]],
		"turn": 0,
		"komi": 7.5
	};
	for(var k in options){	// overide default values
		opts[k] = options[k];
	}
	this._options = opts;

	this._initial = {
		"turn": false,
		"stones": [[],[]]
	};

	var board = [];
	for (var i = 0; i < opts.width; i++) {
		board.push([]);
		for(var j = 0; j < opts.height; j++){
			var space = new Empty([i, j], this);
			board[i].push(space);
		}
	}
	this._board = board;

	if(opts.handicap){
		var turn = 1;
	}else{
		var turn = opts.turn;
	}

	this._turn = (turn) ? 0 : 1;  // reversed when nextMove is called
	this._turns = [];

	this._captures = [0,0];

	this._unique = new Unique(10);

	this._nextMove();
}

Game.prototype = (function(){

	var me = Object.create(null);

	var ether = (function(){
		var me = {};

		var nil = function(){};

		me.is = function(){
			return -5;
		}

		Object.defineProperty(me, 'id', {
			"get": function(){
				return "123ki78jb#";
			}
		});

		Object.defineProperty(me, 'group', {
			"get": function(){
				return me;
			}
		});

		me.distanceTo = function(){
			return 100;
		}

		me.size = function(){
			return 1000;
		}

		me.liberties = function(){
			return 1000;
		}

		return me;
	}());

	var handicaps = [
		[2,2],
		[0,0],
		[0,2],
		[2,0],
		[1,1],
		[2,1],
		[0,1],
		[1,2],
		[1,0]
	];

	var scales = {
		"9x9": [2, 4, 6],
		"13x13": [3, 6, 9],
		"19x19": [3, 9, 15]
	};

	var adjacent = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1]
	];

	me._resetBoard = function(){
		var board = this._board;
		for(var i = 0; i < board.length; i++){
			for(var j = 0; board[i].length; j++){
				if(board[i][j] instanceof Empty){
					continue;
				}else{
					board[i][j] = new Empty([i,j], this);		
				}
			}
		}
		
		return true;
	}

	me._putStone = function(color, point){
		var stone = new Stone(color);
		this._board[point[0]][point[1]] = stone;
		stone.place(point, game);
	}

	me._nextMove = function(){
		var bow = this._turn = (!!this._turn) ? 0 : 1;

		this._turns.push({
			"color": bow,
			"played": [],
			"captured": [],
			"turn": this._turns.length
		});
	}

	me._recordCapture = function(pt){
		var turns = this._turns,
			index = turns.length - 1;

		turns[index].captured.push(pt);
		return true;
	}

	me._recordPlay = function(pt){
		var turns = this._turns,
			index = turns.length - 1;

		turns[index].played.push(pt);
		return true;
	}

	me._getMoveBack = function(i){
		return this._turns[this._turns.length - (2 + i)];
	}

	me._getMoveAt = function(i){
		return this._turns[i];
	}

	me._handicapPlaces = function(n){
		var w = this._options.width,
			h = this._options.height;

		var arr = [],
			han = scales[w + "x" + h];
		for(var i = 0; i < n; i++){
			var of = handicaps[i],
				point = [han[of[0]], han[of[1]]]
			arr.push(point);
		}

		return arr;
	}

	me.unique = function(){
		return this._unique.token();
	}

	/* Information */

	me.at = function(point){
		var opts = this._options;

		if(point[0] < 0 || point[0] >= opts.width){
			return ether;
		}

		if(point[1] < 0 || point[1] >= opts.height){
			return ether;
		}

		// if point is on board return point
		return this._board[point[0]][point[1]];
	}

	// returns 4 value array of adjacent objects, or false, if
	me.adjacent = function(point){
		var array = [];
		for (var i = 0; i < adjacent.length; i++) {
			var pt = adda(adjacent[i], point);
			array.push(this.at(pt));
		}

		return array;
	}

	me.dimensions = function(){
		var o = this._options;
		return [o.width, o.height];
	}

	me.validate = function(point, color, noko){

		// make sure space is empty
		var now = this.at(point);
		if(now.is() !== 5) return false;

		// if point is empty space
		var ncolor = (!!color) ? 0 : 1,
			adj = this.adjacent(point),
			thiss = this,
			freqs = adj.process(function(object){
				return object.is();
			}).histogram();


		// test for ko

		//adjacents muste either be board edge (-5) or opposite color
		if(!noko && !freqs[color] && !freqs[5]){
			var libs = adj.process(function(object){
				var o = object.group;
				if(object.is() !== 5 && o.size() === 1 && o.liberties() === 1){
					return 1;
				}else return 0;
			}),
			freq = libs.histogram();


			if(freq[1] === 1){
				var index = libs.indexOf(1),
					place = adj[index].where(),
					lastt = this._getMoveBack(0);

				if(	lastt.played.length === 1 && 
					lastt.captured.length === 1 &&
					lastt.played[0].is(place) && 
					lastt.captured[0].is(point)){

					return false;
				}
			}
		}

		// if no ko, test for liberties
		var place, nextPlace = adj.iterator(function(ob){
			var is = ob.is();
			return is !== -5;
		});
		while(place = nextPlace()){
			var is = place.is();

			if(is === 5) return true;

			var libs = place.group.liberties();
			if(is === ncolor){
				if(libs <= 1){
					return true;
				}
			}else if(is === color){
				if(libs > 1){
					return true;
				}
			}
		}

		return false;
	}

	/* Commands */


	me.capture = function(group){
		var stone,
			points,
			color = group.color(),
			ncolor = (!!color) ? 0 : 1,
			nextStone = group.stoneIterator(),
			notified = {},
			notify = [];

		while(stone = nextStone()){
			var adj = stone.adjacent(ncolor),
				place = stone.where();

			this._board[place[0]][place[1]] = new Empty(place, this);
			this._captures[color] += 1;
			this._recordCapture(place);

			for (var i = 0; i < adj.length; i++) {
				var group = adj[i].group,
					id = group.id;

				if(!notified[id]){
					notified[id] = true;
					notify.push(group);
				}
			}
		}

		for (var i = 0; i < notify.length; i++) {
			notify[i].calculateLiberties(true);
		}
	}

	/* external commands */

	me.undo = function(){

	}

	me.play = function(pt, id){
		var turn = this._turn;
		if(this._players[turn] !== id){
			return false;
		}

		// validate move..
		var valid = this.validate(pt, turn);
		if(!valid){
			return false;
		}
		
		// if valid: 
		this._putStone(turn, pt);
		this._recordPlay(pt);
		this._nextMove();

		return this.gameStateUpdate();
	}

	me.pass = function(id){
		if(this._players[this._turn] !== id){
			return false;
		}else return this.gameStateUpdate();
	}

	me.resign = function(id){

	}

	me.start = function(){
		var handicap = this._options.handicap;
		if(handicap){
			var h = this._handicapPlaces(handicap);
			for(var i = 0; i < h.length; i++){
				this._putStone(0, h[i]);
			}

			this._initial.turn = 1;
			this._initial.stones[0] = h;
		}else{
			var init = this._options.initial,
				turn = this._options.turn,
				thes = this;

			for(var i = 0; i < 2; i++){
				this._options.initial[i].forEach(function(place){
					var valid = thes.validate(place, i, true);
					if(valid){
						thes._putStone(i, place);
					}else{
						thes._resetBoard();
						return false;
					}
					thes._putStone(i, place);
				});
			}

			this._initial.turn = this._options.turn;
			this._initial.stones = init;
		}

		return this.initialGameState();
	}


	me.gameStateUpdate = function(){
		var ob = this._getMoveBack(0);

		return {
			// if a play has not been made it is a pass
			"type": (ob.played.length) ? "play" : "pass",
			"color": ob.color,

			// false if passing
			"point": (ob.played[0] || false),
			"captures": ob.captured,
			"turn": ob.turn
		}
	}

	me.initialGameState = function(){

		var handicap = this._options.handicap;
		if(handicap){
			return {
				"type": "handicap",
				"handicap": handicap,
				"initial": [
					this._handicapPlaces(handicap),
					[]
				],
				"turn": 1
			};
		}else{
			var turn = this._options.turn,
				init = this._options.initial;

			return {
				"type": "initial",
				"initial": init.clone(true),
				"turn": turn
			};
		}
	}

	return me;
}());

module.exports = Game;