var
	Connections = require('./connections.js'),
	Eyes = require('./eyes.js');

function Score(game){
	this._game = game;
	this._score = [0, 0];

	this._profiles = {};

	var 
		groups = game.getGroups(),
		iterator = groups.iterator();

	while (iterator.hasNext()){
		var group = iterator.next();
		if (group.type() === 5){
			
		}else{
			
		}
	}
}

Score.prototype = (function(){
	var me = {};

	me.isLiving = function(group){

	}

	me.isDead = function(group){

	}

	// returns GroupCollection for groups connected
	me.getConnectedGroups = function(group){

	}

	me.score = function(){

	}

	// returns false if 2 eyes are not found
	me.hasEyes = function(group){
		
	}

	return me;
}());

module.exports = Score;