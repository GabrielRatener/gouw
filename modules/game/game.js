

function adda(){
	var lead = arguments[0], arr = [];
	for (var i = 0; i < lead.length; i++) {
		var sum = 0;
		for(var j = 0; j < arguments.length; j++){
			sum += arguments[j][i]
		}

		arr.push(sum);
	}

	return arr;
}

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

	this.__turn = (!!opts.handicap) ? 1 : 0;

	this.__turns = [];

	this.__groups = {};
}

Game.prototype = (function(){

	var me = Object.create(null);

	var adjacent = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1]
	];

	me.__record = function(point, group){
		var bow = this.__turn;
		this.__turns.push({
			"color": this.__turn,
			"point": point
		});
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

	// returns 4 value array of adjacent points
	me.adjacent = function(point){
		var array = [];
		for (var i = 0; i < adjacent.length; i++) {
			var pt = adda(adjacent[i], point);
			array.push(this.at(pt));
		}

		return array;
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

				if(lastt.added.contains(place) && last.removed.contains(point)){
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

	me.undo = function(){

	}

	me.play = function(id, pt){
		// validate move..



		// if valid: 
		var stone = new Stone(this.__turn);
		stone.place(point);

	}

	me.pass = function(id){

	}

	me.resign = function(id){

	}

	return me;
}());

module.exports = Game;