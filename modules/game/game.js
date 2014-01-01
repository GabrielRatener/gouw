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

var Empty = require('./empty.js'),
	Stone = require('./stone.js'),
	Unique = require('../unique.js');

function Game(players, options){
	// players[0]: black, players[1]: white
	this.__players = players;

	// default values
	var opts = {
		"width": 19,
		"height": 19,
		"handicap": 0,
		"komi": 7.5
	};
	for(var k in options){	// overide default values
		opts[k] = options[k];
	}
	this.__options = opts;

	var board = [];
	for (var i = 0; i < opts.width; i++) {
		board.push([]);
		for(var j = 0; j < opts.height; j++){
			var space = new Empty([i, j], this);
			board[i].push(space);
		}
	}
	this.__board = board;

	this.__turn = (!!opts.handicap) ? 0 : 1;  // reversed when nextMove is called
	this.__turns = [];

	this.__captures = [0,0];

	this.__unique = new Unique(10);

	this.__nextMove();
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

	var adjacent = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1]
	];

	me.__nextMove = function(){
		var bow = this.__turn = (!!this.__turn) ? 0 : 1;

		this.__turns.push({
			"color": bow,
			"played": [],
			"captured": [],
			"turn": this.__turns.length
		});
	}

	me.__recordCapture = function(pt){
		var turns = this.__turns,
			index = turns.length - 1;

		turns[index].captured.push(pt);
		return true;
	}

	me.__recordPlay = function(pt){
		var turns = this.__turns,
			index = turns.length - 1;

		turns[index].played.push(pt);
		return true;
	}

	me.__getMoveBack = function(i){
		return this.__turns[this.__turns.length - (2 + i)];
	}

	me.__getMoveAt = function(i){
		return this.__turns[i];
	}

	me.unique = function(){
		return this.__unique.token();
	}

	/* Information */

	me.at = function(point){
		var opts = this.__options;

		if(point[0] < 0 || point[0] >= opts.width){
			return ether;
		}

		if(point[1] < 0 || point[1] >= opts.height){
			return ether;
		}

		// if point is on board return point
		return this.__board[point[0]][point[1]];
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
		var o = this.__options;
		return [o.width, o.height];
	}

	me.validate = function(point, color){

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
		if(!freqs[color] && !freqs[5]){
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
					lastt = this.__getMoveBack(0);

				if(	
					lastt.played.length === 1 && 
					lastt.captured.length === 1 &&
					lastt.played[0].is(place) && 
					lastt.captured[0].is(point)
				){
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

			this.__board[place[0]][place[1]] = new Empty(place, this);
			this.__captures[color] += 1;
			this.__recordCapture(place);

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
		var turn = this.__turn;
		if(this.__players[turn] !== id){
			return false;
		}

		// validate move..
		var valid = this.validate(pt, turn);
		if(!valid){
			return false;
		}
		
		// if valid: 
		var stone = new Stone(turn);
		this.__board[pt[0]][pt[1]] = stone;
		stone.place(pt, this);
		this.__recordPlay(pt);
		this.__nextMove();

		return this.__getMoveBack(0);
	}

	me.pass = function(id){
		if(this.__players[this.__turn] !== id){
			return false;
		}
	}

	me.resign = function(id){

	}

	return me;
}());

module.exports = Game;