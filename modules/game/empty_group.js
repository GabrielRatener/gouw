var prototype = require('./prototypes/group.js');

function EmptyGroup(game){
	this._id = game.unique();
	this._game = game;

	this._members = [];

	this._stones = [false, false];
	this._ether = false;
}

EmptyGroup.prototype = (function(){
	var me = Object.create(prototype);

	me.adjacent = function(){
		var ob,
			next = this.adjacentIterator(true);
		while(ob = next()){
		}
	}

	me.adjacents = function(){
		var s = this._stones;

		return s[0] + s[1] + this._ether;
	}

	me.is = function(){
		return 5;
	}

	return me;
}());

module.exports = EmptyGroup;