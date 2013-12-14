function Unique(length){
	this.__taken = [];
	this.__length = length;
}

Unique.prototype = (function(){
	var me = {};

	var CHARS = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	me.token = function(){
		do{
			var str = "";
			for(var i = 0; i < this.__length; i++){
				var randy = CHARS.length * Math.random();
				str += CHARS[Math.floor(randy)].toString();
			}
		}while(str in this.__taken);

		this.__taken.push(str);
		return str;
	}

	me.free = function(token){
		var index = this.__taken.indexOf(token);

		if(index < 0) return false;
		else{
			this.__taken.splice(index, 1);
			return true;
		}
	}

	me.isFree = function(token){
		return !(this.__taken.indexOf(token) < 0);
	}

	return me;
}());

module.exports = Unique;