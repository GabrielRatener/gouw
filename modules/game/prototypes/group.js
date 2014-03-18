var 
	GroupCollection = require('../group_collection.js'),
	LocationCollection = require('../location_collection.js');

module.exports = (function(){
	var me = {
		get game(){
			return this._game;
		},

		get id(){
			return this._id;
		}
	};

	me.memberIterator = function(){
		var i = 0;
		return function(){
			if(i < this._members.length){
				return this._members[i];
				i++;
			}else return false;
		}
	}

	me.getId = function(){
		return this._id;
	}

	me.size = function(){
		return this._members.length;
	}

	me.adjacentPlaces = function(){
		var 
			places = new LocationCollection(),
			color = this.is();
		for(var i = 0; i < this._members.length; i++){
			var 
				adj = this._members[i].adjacentPlaces(),
				iterator = adj.iterator(color, true);

			while (iterator.hasNext()) {
				places.add(iterator.next());
			}
		}

		return places;
	}

	me.adjacentGroups = function(){
		var 
			groups = new GroupCollection(),
			places = this.adjacentPlaces();

		groups.add(places.query());
		return groups;
	}

	// ether option when set to true will return the offboard object when adjacent
	// by default this is skipped
	me.crawlAdjacent = function(ether){
		var 
			hash = {},
			next = memberIterator(),
			anext = function(){};

		var forward = function(){
			ob = anext();
			if(!ob){
				var arr = next();
				if(arr){
					anext = arr.iterator();
					ob = anext();
				}else return false;
			}

			var lin = ob.placeNumber();
			if((!ether && lin < 0) ||
				hash.hasOwnProperty(lin) ||
				lin === this._is){

				return forward();
			}else{
				hash[ln] = true;
				return ob;
			}
		}
	}

	return me;
}());