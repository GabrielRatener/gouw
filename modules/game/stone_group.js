var prototype = require('./prototypes/group.js');

function StoneGroup(game, color){
	this.__id = game.unique();


	this.__members = [];

	this.__game = game;

	this.__liberties = false;

	this.__dimensions = game.dimensions();

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
		if(members){
			for(var i = 0; i < members.length; i++){
				var dist = members[i].distanceTo(stone);
				if(dist === 1){
					adjacent = true;
				}else if(dist === 0){
					return false;
				}
			}

			if(adjacent){
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

		for (var i = 0; i < cluster.length; i++) {
			cluster[i].setGroup(this);
			this.__members.push(cluster[i]);
		}

		me.calculateLiberties();
	}

	// calculates liberties of current group members;
	me.calculateLiberties = function(){
		var hash = {},
			members = this.__members,
			liberties = 0;

		for(var i = 0; i < members.length; i++){
			var adj = members.adjacent(5);
			for(var j = 0; j < adj.length; j++){
				var pn = adj[i].placeNumber();
				if(hash.hasOwnProperty(pn)){
					continue;
				}else{
					hash[pn] = true;
					liberties += 1;
				}
			}
		}

		this.__liberties = liberties;
		return liberties;
	}

	me.liberties = function(){
		return this.__liberties;
	}

	me.takeLiberty = function(){
		this.__liberties -= 1;
		if(this.__liberties === 0){
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
			if(i >= stone.length){
				return false;
			}else{
				i += 1;
				return stones[i - 1];
			}
		}
	}

	me.hashable = function(){
		return this.__id;
	}

	return me;
}());

module.exports = StoneGroup;