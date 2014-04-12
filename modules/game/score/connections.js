function Connections(){
	this._pairs = {};
}

Connections.prototype = (function(){
	var me = {};

	function connectionCode(group1, group2){
		var
			h1 = group1.id,
			h2 = group2.id;

		if(h1 < h2){
			return h1 + '_' + h2;
		}else if(h1 > h2){
			return h2 + '_' + h1;
		}
	}

	// ok, I will admit, this is alot of code for one method, but this is an important one
	me.directlyConnectedGroups = function(group){

		var
			collection = new GroupCollection(),
			places = group.adjacentPlaces(),
			color = group.is(),
			iterator = places.iterator(5);

		while (iterator.hasNext()) {
			var
				e = iterator.next(),
				agroups = e.group.adjacentGroups();

			if (agroups.count(color, true) === 0){
				// if area is surrounded by stones of same color consider all groups attached
				var iterator = agroups.iterator();
				while (iterator.hasNext()){
					var grupe = iterator.next();
					if(grupe === group){
						continue;
					}else{
						collection.add(grupe);
					}
				}

				continue;
			}

			var
				adj = e.adjacentGroups(),
				outerGroups = adj.iterator(color);

			while (outerGroups.hasNext()) {
				var og = outerGroups.next();

				if (og.id === group.id){
					// dont include connections back to original group
					continue;
				}

				var 
					ogEdge = og.adjacentPlaces(),
					overlap = ogEdge.overlap(ogEdge, 5),
					count = overlap.count();	// all those declarations amount to this

				if (count < 2) {
					if (count === 1 && color === turn){
						collection.add(og);
					}
				}else{
					collection.add(og);
				}
			}
		}

		collection.add(group);
		return collection;
	}

	me.connectedGroups = function(group, _hash){
		var returnaval = false;
		if (_hash === undefined){
			_hash = {};
			returnaval = true;
		}

		var 
			dc = this.directlyConnectedGroups(group),
			iterator = dc.iterator();
		while (iterator.hasNext()){
			var 
				connectee = iterator.next(),
				string = connectee.id;

			if (_hash.hasOwnProperty(string)){
				continue;
			}else{
				_hash[string] = connectee;
				this.connectedGroups(connectee, _hash);
			}
		}

		if (returnaval){
			var collection = new GroupCollection();
			for (var key in _hash){
				collection.add(_hash[key]);
			}

			return collection;
		}
	}

	return me;
}());