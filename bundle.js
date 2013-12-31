var Game = require('modules/game/game.js');

function toggle(){
	if(TURN === 0){
		TURN = 1;
	}else{
		TURN = 0;
	}

	return TURN;
}


var TURN = 0, names = ['gabe', 'ebag'];

var board = new Board(
	document.querySelector("#board"),
	{
		"size": [19, 19]
	}
);

var game = new Game(names, {});

function syncFactory(){
	var hash = {}, i = false;
	return function(num, func){
		if(i === false){
			i = num;
		}

		if(i === num){
			func(i);
			i += 1;

			while(hash.hasOwnProperty(i)){
				hash[i](i);
				delete hash[i];

				i += 1;
			}
		}else{
			if(num < i) return false;
			else{
				hash[i] = func;
			}
		}

		return true;
	}
}


sync = syncFactory();

board.ontileclick = function(pt){
	var play = game.play(pt, names[TURN]);

	if(play){
		var ob = {
			"type": "play",
			"color": play.color,
			"point": play.played[0],
			"captures": play.captured,
			"turn": play.turn
		};

		sync(ob.turn, function(){
			board.play(ob.point, ob.color);
			board.remove(ob.captures);
			toggle();
		});
	}
}

board.ontilehover = function(pt){
	this.putGhost(pt, TURN);
}
