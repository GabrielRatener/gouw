module.exports = (function(){
	var me = {};

	// Yay, recursion!!!!
	me.__crawl = function(is, hash, cluster){
		var adj = this.adjacent();

		for (var i = 0; i < adj.length; i++) {
			var num = this.__placeNumber(adj[i]);
			if(adj[i].is() === is && !ob.hash[num]){
				hash[num] = true;
				cluster.push(adj[i]);
				adj[i].__crawl(is, hash, cluster);
			}
		}
	}

	me.setPlace = function(coords, game){
		this.__place = coords;
		this.__game = game;
	}

	me.isPlaced = function(){
		return !!this.__place;
	}

	me.group = function(){
		return this.__group;
	}

	me.place = function(){
		return this.__place.splice(0);
	}

	me.is = function(){
		return this.__is;
	}

	// gives unique linearized number of position (to use in hash tables)
	me.placeNumber = function(place){
		var place = this.__place;
		return place[0] * this.__dimensions[1] + place[1];
	}	

	me.crawl = function(hash, cluster){
		//object can be used instead of 

		var is = this.is();
		if(arguments.length < 2){
			var cluster = [];
			if(arguments.length === 0){
				var hash = {};
			}
		}

		this.__crawl(is, hash, cluster);

		return cluster;
	}

	me.adjacent = function(type){
		var pt = this.__place,
			adj = this.__game.adjacent(pt);

		if(type === undefined){
			return adj;
		}else{
			var ret = [];
			for (var i = 0; i < adj.length; i++) {
				var is = adj[i].is();
				if(is === type){
					ret.push(adj[i]);
				}
			}

			return ret;
		}
	}

	me.distanceTo = function(location, vectorForm){
		var p1 = location.place(),
			p2 = this.place();

		var vector = [p2[0] - p1[0], p2[1] - p1[1]];
		if(vectorForm){
			return vector;
		}else{
			return Math.abs(vector[0]) + Math.abs(vector[1]);
		}
	}

	return me;
}());