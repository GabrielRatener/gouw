module.exports = (function(){
	var me = {
		get game(){
			return this.__game;
		},

		get id(){
			return this.__id;
		}
	};

	me.getId = function(){
		return this.__id;
	}

	me.size = function(){
		return this.__members.length;
	}

	return me;
}());