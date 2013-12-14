function Profile(socket){
	this.__socket = socket;

	this.__info = {
		"socket": socket,
		"playing": false,
		"name": Names.uniqueName()
	};

	this.__ghost = false;
}

Profile.prototype = (function(){
	var me = {};

	me.takeMe = function(){
		return this.__ghost;
	}

	me.erase = function(){
		this.__ghost = true;
		return this.__ghost;
	}

	me.getField = function(index){
		if(this.__info.hasOwnProperty(index)){
			if(index == 'socket') return this.__socket.id;
			else return this.__info[index];
		}else return false;
	}

	me.send = function(evt, data){
		this.__info.socket.emit(evt, data);
		return true;
	}

	me.on = function(evt, func){
		this.off(evt);
		this.__info.socket.on(evt, func);
	}

	me.off = function(evt){
		this.__info.socket.removeListener(evt);
	}

	return me;
}());

module.exports = Profile;
