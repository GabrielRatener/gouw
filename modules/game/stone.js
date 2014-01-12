var prototype = require('./prototypes/location.js');

var StoneGroup = require('./stone_group.js');

function Stone(color){
	// inherent property
	this._color = color;

	// fixed property (once set)
	this._place = false;
	this._game = false;

	//not fixed
	this._group = false;
}

Stone.prototype = (function(){
	var me = Object.create(prototype);	

	me.is = function(){
		return this._color;
	}

	me.place = function(place, game, quiet){
		if(this._place || this._game){
			return false;
		}

		this._place = place;
		this._game = game;

		// in quiet mode no grouping takes place
		if(quiet) return true;

		var biggest,
			maxSize = 0,
			adj = this.adjacent(),
			color = this._color,
			grouped = {},
			groups = [];

		for (var i = 0; i < adj.length; i++) {
			if(!adj[i]){
				continue;
			}else{
				var is = adj[i].is(),
					group = adj[i].group,
					id = group.id;
				if(is === color){
					var size = group.size();
					if(size > maxSize){
						maxSize = size;
						biggest = group;
					}
				}
			}
		}

		if(biggest){
			biggest.crawl();
		}else{
			this.spawnGroup();
		}

		return this.group.updateAdjacentGroups(true);
	}

	me.spawnGroup = function(){
		var game = this._game,
			color = this._color,
			sg = new StoneGroup(game, color);

		sg.addStone(this);
		return sg;
	}

	me.setGroup = function(group){
		this._group = group;
		return true;
	}
	
	return me;
}());

module.exports = Stone;