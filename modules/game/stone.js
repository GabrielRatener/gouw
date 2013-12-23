var prototype = require('./prototypes/location.js');

var StoneGroup = require('./stone_group.js');

function Stone(color){
	// inherent property
	this.__color = color;

	// fixed property (once set)
	this.__place = false;
	this.__game = false;

	//not fixed
	this.__group = false;
}

Stone.prototype = (function(){
	var me = Object.create(prototype);	

	me.is = function(){
		return this.__color;
	}

	me.where = function(){
		return this.__place.splice(0);
	}

	me.place = function(place, game){
		if(this.__place || this.__game){
			return false;
		}

		this.__place = place;
		this.__game = game;

		var biggest,
			maxSize = 0,
			adj = this.adjacent(),
			color = this.__color;

		for (var i = 0; i < adj.length; i++) {
			if(!adj[i]){
				continue;
			}else{
				var is = adj[i].is();
				if(is === color){
					var size = adj[i].size();
					if(size > maxSize){
						maxSize = size;
						biggest = adj[i];
					}
				}else if([0, 1].contains(is)){
					adj[i].calculateLiberties();
				}
			}
		}

		biggest.crawl();
	}

	me.spawnGroup = function(){
		var game = this.__game,
			color = this.__color,
			sg = new StoneGroup(game, color);

		sg.addStone(this);
	}

	me.setGroup = function(group){
		this.__group = group;
		return true;
	}
	
	return me;
}());

module.exports = Stone;