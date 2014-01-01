function Unique(length){
	this._taken = [];
	this._length = length;
}

Unique.prototype = (function(){
	var me = {};

	var CHARS = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	me.token = function(){
		do{
			var str = "";
			for(var i = 0; i < this._length; i++){
				var randy = CHARS.length * Math.random();
				str += CHARS[Math.floor(randy)].toString();
			}
		}while(str in this._taken);

		this._taken.push(str);
		return str;
	}

	me.free = function(token){
		var index = this._taken.indexOf(token);

		if(index < 0) return false;
		else{
			this._taken.splice(index, 1);
			return true;
		}
	}

	me.isFree = function(token){
		return !(this._taken.indexOf(token) < 0);
	}

	return me;
}());

module.exports = Unique;