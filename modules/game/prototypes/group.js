module.exports = (function(){
	var me = {
		get game(){
			return this._game;
		},

		get id(){
			return this._id;
		}
	};

	me.getId = function(){
		return this._id;
	}

	me.size = function(){
		return this._members.length;
	}

	return me;
}());