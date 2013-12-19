var prototype = require('./prototypes/group.js');

function StoneGroup(game, color){
	this.__members = [];
	this.__id = game.token();

	this.__game = game;

	this.__dimensions = game.dimensions();
}

StoneGroup.prototype = (function(){
	var me = Object.create(prototype);

	me.__addStone = function(stone){
		stone.setGroup(this);
		this.__members.push(stone);
	}

	me.__crawl = function(){
		var 
	}

	me.__stoneNumber = function(stone){
		var place = stone.place();
		return place[0] * this.__dimensions[1] + place[1];
	}

	me.addStone = function(stone){
		var members = this.__members,
			adjacent = false;
		if(members){
			for(var i = 0; i < members.length; i++){
				var dist = members[i].distanceTo(stone);
				if(dist === 1){
					adjacent = true;
				}else if(dist === 0){
					return false;
				}
			}

			if(adjacent){
				this.__addStone(stone);
				return true;
			}else return false;
		}else{
			this.__addStone(stone);
			return true;
		}
	}

	me.crawl = function(){

	}

	return me;
}());

module.exports = StoneGroup;