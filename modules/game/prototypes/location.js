module.exports = (function(){
	var me = {};

	me.__placeNumber = function(place){
		var place = this.__place;
		return place[0] * this.__dimensions[1] + place[1];
	}

	me.__crawl = function(hash, place){
			
	}

	me.setPlace = function(coords){
		this.__place = coords;
	}

	me.update = function(){
		var game = this.__group.game();
		this.__adjacent = game.adjacent();
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