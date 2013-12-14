var prototype = require('./prototypes/location.js');

function Stone(color){
	this.__color = color;
	this.__place = false;

	this.__group = false;

	this.__adjacent = false;

	this.__special = false;
}

Stone.prototype = (function(){
	var me = Object.create(prototype);	

	me.is = function(){
		return this.__color;
	}
	
	return me;
}());

module.exports = Stone;