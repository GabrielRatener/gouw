var prototype = require('./prototypes/location.js');

function Empty(){
	this.__group = false;

	this.__place = false;
	this.__adjacent = false;

	this.__special = false;
}

Empty.prototype = (function(){
	var me = Object.create(prototype);

	me.__is = "empty";

	return me;
}());

module.exports = Empty;