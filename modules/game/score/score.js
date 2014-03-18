function Score(game){
	this._game = game;
	this._score = [0, 0];
}

Score.prototype = (function(){
	var me = {};

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