
/* Gennerally useful methods */

//element wise array addition
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

// counts frequency of each element in array
function freqa(array){
	var obj = {};

	for (var i = 0; i < array.length; i++) {
		if(obj.hasOwnProperty(array[i])){
			obj[array[i]]++;
		}else{
			obj[array[i]] = 1;
		}
	};
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

	this.__turn = (!!handicap) ? 1 : 0;

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

	me.isValidMove = function(point, color){

		// make sure space is empty
		var now = this.at(point);
		if(!now || now.is() !== "empty") return false;

		// if point is empty space
		var hspec = now.special(),
			hgroup = now.group(),
			hsize = hgroup.getSize();


		// 
		var col = color || this.__turn;
			ad = this.adjacent(point),
			ml = [],
			hl = [];

		// booleans


		for(var i = 0; i < ad.length; i++){
			if(ad[i]){
				var is = ad[i].is();
				if(is === "empty") return true;
				else{
					var group = ad[i].group(),
						liberties = group.liberties();
					if(is === col){
						if(liberties > 1) return true;
						else ml.push(liberties);
					}else{
						var size = group.getSize(),
							spec = ad[i].special();
					}
				}
			}
		}
	}

	/* Commands */

	me.undo = function(){

	}

	me.play = function(point){
		// validate move..



		// if valid: 
		var stone = new Stone(this.__turn);
		stone.place(point);

	}

	me.pass = function(){

	}

	me.resign = function(){

	}

	return me;
}());