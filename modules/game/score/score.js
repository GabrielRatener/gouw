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
		var 
			surroundingGroups = group.adjacentGroups(),
			surroundingAreas = surroundingGroups.query(5),
			surroundingIterator = surroundingAreas.iterator();

		while (surroundingIterator.hasNext()){
			var 
				area = surroundingIterator.next(),

		}
	}

	me.isDead = function(group){

	}

	// returns GroupCollection for groups connected
	me.getConnectedGroups = function(group){
		
	}

	me.score = function(){

	}

	me.eyeCount = function(group){
		var
			count = 0,
			surrounders = group.adjacentGroups(),
			iterator = surrounders.iterator(5);

		while (iterator.hasNext()){
			var area = iterator.next();

			if (area.adjacentGroups().count(group.is()) === 1){
				count += 1;
			}
		}

		return count;
	}

	return me;
}());

module.exports = Score;