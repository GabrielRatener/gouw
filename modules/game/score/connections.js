function Connections(){
	this._pairs
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

	me.findConnectedGroups = function(group){
		var
			places = group.adjacentPlaces(),
			color = group.is(),
			iterator = places.iterator(5),
			igEdge = group.adjacentPlaces(),
			unique = {},
			shsared = {};

		while (iterator.hasNext()) {
			var
				e = iterator.next(),
				adj = e.adjacentGroups(),
				outerGroups = adj.iterator(color);

			while (outerGroups.hasNext()) {
				var og = outerGroups.next();

				if (og.id === group.id){
					continue;
				}

				var 
					ogEdge = og.adjacentPlaces(),
					overlap = ogEdge.overlap(igEdge, 5),
					count = overlap.count();

				if (count < 2) {
					continue;
				}

				if (count > 2) {
					var h = connectionCode(group, og);
					unique[h] = 
				}else{

				}
			}
		}
	}

	return me;
}());