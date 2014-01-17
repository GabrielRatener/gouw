var Names = (function(){
	var me = {};

	var NOUNS = [
		"noodle",
		"centrifuge",
		"home",
		"store",
		"war",
		"cold",
		"system",
		"book",
		"trick",
		"airplane",
		"jet",
		"isentrope",
		"volcano",
		"shirt",
		"whisper",
		"gradient",
		"slope",
		"whale",
		"cloud",
		"potato",
		"cyclone",
		"layer",
		"surface",
		"blimp",
		"helicopter",
		"zebra",
		"nautilus",
		"smoothie",
		"tornado",
		"phone",
		"equation",
		"drug",
		"race",
		"crest",
		"planet",
		"orbit",
		"star",
		"emission",
		"typo",
		"glow",
		"storm",
		"soap",
		"strawberry",
		"guava",
		"fig",
		"ficus",
		"stone",
		"door",
		"crab",
		"clam",
		"lamp",
		"spider",
		"viper",
		"chicken"
	];

	var ADJECTIVES = [
		"wasteful",
		"distasteful",
		"barotropic",
		"volcanic",
		"isotropic",
		"windy",
		"long",
		"juicy",
		"slender",
		"spicy",
		"sweet",
		"slimy",
		"snowy",
		"humid",
		"african",
		"american",
		"opaque",
		"transparent",
		"happy",
		"ethical",
		"unethical",
		"chewy",
		"sleek",
		"bright",
		"dull",
		"alternate",
		"grueling",
		"fierce",
		"tropical",
		"subtropical",
		"polar",
		"incorrect",
		"awesome",
		"intense",
		"curvy",
		"coy",
		"brave",
		"delightful",
		"insightful",
		"intellectual",
		"anonymous",
		"crazy",
		"drastic",
		"legal",
		"liquid",
		"icy",
		"grumpy",
		"brute",
		"peachy",
		"scarce",
		"frozen",
		"happy"
	];

	var stash = (function(){
		var me = {};

		var reserved = [];

		me.reserve = function(name){
			if(name in reserved){
				return false;
			}else{
				reserved.push(name);
				return true;
			}
		}

		me.taken = function(name){
			return (name in reserved);
		}

		me.free = function(name){
			if(name in reserved){
				return false;
			}else{
				var index = reserved.indexOf(name);
				reserved.splice(index, 1);
				return true;
			}
		}

		return me;
	}());

	function randomNoun(){
		var index = Math.floor(NOUNS.length * Math.random());
		return NOUNS[index];
	}

	function randomAdjective(){
		var index = Math.floor(ADJECTIVES.length * Math.random());
		return ADJECTIVES[index];
	}

	me.uniqueName = function(){
		do{
			var same = Math.floor(2 * Math.random());
			if(same){
				var n1 = randomNoun();
				do{
					var n2 = randomNoun();
				}while(n1 === n2);
			}else{
				var n1 = randomAdjective(),
					n2 = randomNoun();
			}

			var name = n1 + " " + n2;
		}while(stash.taken(name));

		stash.reserve(name);
		return name;
	}

	me.freeName = function(name){
		stash.free(name);
	}

	return me;
}());


function Profile(socket){
	this._socket = socket;

	this._info = {
		"socket": socket,
		"playing": false,
		"name": Names.uniqueName()
	};

	this._ghost = false;
}

Profile.prototype = (function(){
	var me = {
		get uid(){
			return this._socket.id;
		},
		set uid(val){
			console.log("read only");
		},


		get uname(){
			return this._info.name;
		},
		set uname(val){
			console.log("read only");
		}
	};

	me.takeMe = function(){
		return this._ghost;
	}

	me.erase = function(){
		this._ghost = true;
		return this._ghost;
	}

	me.getField = function(index){
		if(this._info.hasOwnProperty(index)){
			if(index == 'socket') return this._socket.id;
			else return this._info[index];
		}else return false;
	}

	me.send = function(evt, data){
		this._info.socket.emit(evt, data);
		return true;
	}

	me.on = function(evt, func){
		this.off(evt);
		this._info.socket.on(evt, func);
	}

	me.off = function(evt){
		this._info.socket.removeAllListeners(evt);
	}

	return me;
}());

module.exports = Profile;
