module.exports = (function(){
	var me = {};

	me.place = function(coords){
		this.__place = coords;
		this.update();
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

	me.is = function(){
		return this.__is;
	}

	return me;
}());