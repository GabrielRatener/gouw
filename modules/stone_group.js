var prototype = require('./prototypes/group.js');

function StoneGroup(game, color){
	this.__members = [];
	this.__id = game.token();

	this.__game = game;
}

StoneGroup.prototype = (function(){
	var me = Object.create(prototype);

	return me;
}());