module.exports = (function(){
	var me = {
		// getters and/or setters
		get group(){
			return this._group;
		},


		get game(){
			return this._game;
		}
	};

	// Yay, recursion!!!!
	me._crawl = function(is, hash, cluster){
		
		var num = this.placeNumber();
		if(this.is() === is && !hash[num]){
			hash[num] = true;
			cluster.push(this);
		}

		var adj = this.adjacent(is);
		for (var i = 0; i < adj.length; i++) {
			var num = adj[i].placeNumber();
			if(adj[i].is() === is && !hash[num]){
				hash[num] = true;
				cluster.push(adj[i]);
				adj[i]._crawl(is, hash, cluster);
			}
		}
	}

	me.group = function(){
		return this._group;
	}

	me.isGrouped = function(){
		return this._group !== false;
	}

	me.setPlace = function(coords, game){
		this._place = coords;
		this._game = game;
	}

	me.isPlaced = function(){
		return !!this._place;
	}

	me.where = function(){
		return this._place.slice(0);
	}

	me.is = function(){
		return this._is;
	}

	// gives unique linearized number of position (to use in hash tables)
	me.placeNumber = function(){
		var place = this._place,
			dims = this._game.dimensions();
		return place[0] * dims[1] + place[1];
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

		this._crawl(is, hash, cluster);

		return cluster;
	}

	me.adjacent = function(type){
		var pt = this._place,
			adj = this._game.adjacent(pt);

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
		var p1 = location.where(),
			p2 = this.where();

		var vector = [p2[0] - p1[0], p2[1] - p1[1]];
		if(vectorForm){
			return vector;
		}else{
			return Math.abs(vector[0]) + Math.abs(vector[1]);
		}
	}

	return me;
}());