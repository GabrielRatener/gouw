var prototype = require('./prototypes/group.js');

function StoneGroup(game, color){
	this.__id = game.unique();


	this.__members = [];

	this.__game = game;

	this.__liberties = false;

	this.__color = color;
}

StoneGroup.prototype = (function(){
	var me = Object.create(prototype);

	me.__addStone = function(stone){
		stone.setGroup(this);
		this.__members.push(stone);
	}

	me.addStone = function(stone){
		var members = this.__members,
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

				this.__addStone(stone);
			}else return false;
		}else{
			this.__addStone(stone);
		}

		this.crawl();

		return true;
	}

	me.crawl = function(){
		var cluster = [],
			hash = {};
		
		for(var i = 0; i < this.__members.length; i++){
			var num = this.__members[i].placeNumber();
			hash[num] = true;
		}

		for(var i = 0; i < this.__members.length; i++){
			this.__members[i].crawl(hash, cluster);
		}

		for (var i = 0; i < cluster.length; i++){
			this.__addStone(cluster[i]);
		}

		this.calculateLiberties();
	}

	// calculates liberties of current group members;
	// if capture is set to true the group will have itself captured if count is 0
	me.calculateLiberties = function(capture){
		var hash = {},
			members = this.__members,
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

		this.__liberties = liberties;

		if(capture && liberties === 0){
			this.__game.capture(this);
		}

		return liberties;
	}

	me.liberties = function(){
		return this.__liberties;
	}

	me.takeLiberty = function(capture){
		this.__liberties -= 1;
		if(capture && this.__liberties === 0){
			this.__game.capture(this);
		}

		return this.__liberties;
	}

	me.color = function(){
		return this.__color;
	}

	me.stoneIterator = function(){
		var i = 0,
			stones = this.__members;
		return function(){
			if(i >= stones.length){
				return false;
			}else{
				i += 1;
				return stones[i - 1];
			}
		}
	}

	me.updateAdjacentGroups = function(capture){
		var notified = {},
			members = this.__members,
			ocol = (this.__color) ? 0 : 1;

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
		return this.__id;
	}

	return me;
}());

module.exports = StoneGroup;