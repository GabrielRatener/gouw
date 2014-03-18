var prototype = require('./prototypes/group.js');

function StoneGroup(game, color){
	this._id = game.unique();


	this._members = [];

	this._game = game;

	this._liberties = false;

	this._color = color;
}

StoneGroup.prototype = (function(){
	var me = Object.create(prototype);

	me._addStone = function(stone){
		stone.setGroup(this);
		this._members.push(stone);
	}

	me.addStone = function(stone){
		var members = this._members,
			adjacent = false;

		if(members.length){
			for(var i = 0; i < members.length; i++){
				var dist = members[i].distanceTo(stone);			
				if(dist === 1){
					adjacent = true;
				}else if(dist === 0){
					return false;
				}
			}

			if(adjacent.length){

				this._addStone(stone);
			}else return false;
		}else{
			this._addStone(stone);
		}

		this.crawl();

		return true;
	}

	me.crawl = function(){
		var cluster = [],
			hash = {};
		
		for(var i = 0; i < this._members.length; i++){
			var num = this._members[i].placeNumber();
			hash[num] = true;
		}

		for(var i = 0; i < this._members.length; i++){
			this._members[i].crawl(hash, cluster);
		}

		for (var i = 0; i < cluster.length; i++){
			this._addStone(cluster[i]);
		}

		this.calculateLiberties();
	}

	// calculates liberties of current group members;
	// if capture is set to true the group will have itself captured if count is 0
	me.calculateLiberties = function(capture){
		var hash = {},
			members = this._members,
			liberties = 0;

		for(var i = 0; i < members.length; i++){
			var adj = members[i].adjacent(5);
			for(var j = 0; j < adj.length; j++){	
				var pn = adj[j].placeNumber();
				if(hash.hasOwnProperty(pn)){
					continue;
				}else{
					hash[pn] = true;
					liberties += 1;
				}
			}
		}

		this._liberties = liberties;
		return true;
	}

	me.is = function(){
		return this._color;
	}

	me.liberties = function(){
		return this._liberties;
	}

	// method is defacated
	me.takeLiberty = function(capture){
		this._liberties -= 1;
		if(capture && this._liberties === 0){
			this._game.capture(this);
		}

		return this._liberties;
	}

	me.color = function(){
		return this._color;
	}

	me.stoneIterator = function(){
		var i = 0,
			stones = this._members;
		return function(){
			if(i >= stones.length){
				return false;
			}else{
				i += 1;
				return stones[i - 1];
			}
		}
	}

	// use is defacated and will not be included in future versions
	me.updateAdjacentGroups = function(capture){
		var notified = {},
			members = this._members,
			ocol = (this._color) ? 0 : 1;

		for(var i = 0; i < members.length; i++){
			var aj = members[i].adjacent(ocol);
			for (var j = 0; j < aj.length; j++) {
				var group = aj[j].group,
					id = group.hashable();

				if(!notified[id]){
					notified[id] = true;
					group.calculateLiberties(capture);
				}
			}
		}

		return true;
	}

	me.hashable = function(){
		return this._id;
	}

	return me;
}());

module.exports = StoneGroup;