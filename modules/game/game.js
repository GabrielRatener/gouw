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

var Unique = require('../unique.js');

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
			var space = new Empty(i, j);
			space.place([i,j]);
			board[i].push(space);
		}	
	}
	this.__board = board;

	this.__turn = (!!opts.handicap) ? 0 : 1;
	this.__turns = [];

	this.__captures = [0,0];

	this.__unique = new Unique(10);

	this.__nextMove();
}

Game.prototype = (function(){

	var me = Object.create(null);

	var adjacent = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1]
	];

	me.__nextMove = function(){
		var bow = this.__turn;
		this.__turns.push({
			"color": bow,
			"played": [],
			"captured": []
		});

		this.__turn = (!!bow) ? 0 : 1;
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

	/* Information */

	me.at = function(point){
		if(point[0] < 0 || point[0] >= opts.width){
			return false;
		}

		if(point[1] < 0 || point[1] >= opts.height){
			return false;
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
		if(!now || now.is() !== "empty") return false;

		// if point is empty space
		var ads = this.adjacent(point),
			ncolor = (!!color) ? 0 : 1;
			pcs = ads.process(function(pt){
				return this.at(pt);
			}),
			freqs = pcs.process(function(object){
				return object.is();
			}).histogram();


		// test for ko
		if(freqs[ncolor] === 4){
			var libs = pcs.process(function(object){
				if(object.size() === 1 && object.liberties() === 1){
					return 1;
				}else return 0;
			}),
			freq = libs.histogram();

			if(freq[0] === 1){
				var index = freq.indexOf(1),
					place = adjacent[index],
					lastt = this.__turns[this.__turns.length - 1];

				if(lastt.played.contains(place) && lastt.captured.contains(point)){
					return false;
				}
			}
		}

		// if no ko, test for liberties
		var finale = pcs.process(function(obj){
			var is = obj.is();
			if(is === color){
				if(obj.group().liberties() > 1) return 0;
				else return 1;
			}else if(is === ncolor){
				if(obj.group().liberties() > 1) return 1;
				else return 0;
			}else return 0;
		}).histogram();

		if(finale[0]) return true;
		else return false;
	}

	/* Commands */


	me.capture = function(group){
		var stone,
			points,
			color = group.color(),
			ncolor = (!!color) ? 0 : 1,
			nextStone = group.stoneIterator(),
			notify = [];

		while(stone = nextStone()){
			var adj = stone.adjacent(ncolor),
				place = stone.where();

			this.__board[place[0]][place[1]] = new Empty(place, game);
			this.__captures[color] += 1;
			this.__recordCapture(place);

			for (var i = 0; i < adj.length; i++) {
				var group = adj[i].group();
				if(!notify.contains(group)){
					notify.push(group);
				}
			}
		}

		for (var i = 0; i < notify.length; i++) {
			notify[i].calculateLiberties();
		}
	}

	/* external commands */

	me.undo = function(){

	}

	me.play = function(id, pt){
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
		stone.place(pt, game);
		this.__recordPlay(pt);
		this.__nextMove();

		return true;
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