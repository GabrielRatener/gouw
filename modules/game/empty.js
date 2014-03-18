var prototype = require('./prototypes/location.js');

function Empty(place, game){
	this._group = false;

	this._place = place;
	this._game = game;
}

Empty.prototype = (function(){
	var me = Object.create(prototype);

	me.is = function(){
		return 5;
	}

	return me;
}());

module.exports = Empty;