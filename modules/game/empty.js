var prototype = require('./prototypes/location.js');

function Empty(place, game){
	this.__group = false;

	this.__place = place;
	this.__game = game;
}

Empty.prototype = (function(){
	var me = Object.create(prototype);

	me.__is = 5;

	return me;
}());

module.exports = Empty;