function ProfileList(){
	var thethis = this;

	if(arguments.length === 1){
		var profs = arguments[0];
	}else{
		var profs = [];
		for (var i = 0; i < arguments.length; i++) {
			profs.push(arguments[i]);
		}
	}

	//var profileHash = new SmartHash();
	this.__profileHash = {};
	for (var i = 0; i < profs.length; i++) {
		var sock = profs[i].getField("socket");
		this.__profileHash[sock] = profs[i];
	}

	this.__profs = profs;

	var me = this;
	Object.defineProperty(this, 'length', {
		get:function(){
			return me.__profs.length;
		},
		set:function(too){
			console.error("read only");
		}
	});

	this.__sweeper = setInterval(function(){
		thethis.__cleanList();
	}, 60000);
}

ProfileList.prototype = (function(){
	var me = {};

	me.__cleanList = function(){
		var i = 0;
		while(this.__profs[i]){
			if(this.__profs[i].takeMe()){
				this.__profs.splice(i, 1);
			}else i++;
		}

		return true;
	}

	me.addSocket = function(socket){
		var profile = new Profile(socket);
		this.__profs.push(profile);
		this.__profileHash[socket.id] = profile;

		return profile;
	}

	me.removeSocket = function(socket){
		var uid = socket.id,
			profile = this.__profileHash[uid];

		profile.erase();
		delete this.__profileHash[uid];

		return true;
	}

	me.addProfile = function(profile){
		this.__profs.push(profile);
	}

	me.send = function(type, data){
		for (var i = 0; i < this.__profs.length; i++) {
			this.__profs[i].send(type, data);
		}
	}

	me.on = function(evt, func){
		for (var i = 0; i < this.__profs.length; i++) {
			this.__profs[i].on(evt, func);
		}
	}

	me.off = function(evt){
		for (var i = 0; i < this.__profs.length; i++) {
			this.__profs[i].off(evt);
		}
	}

	me.at = function(index){
		return this.__profs[index];
	}

	me.bid = function(id){
		return this.__profileHash[id];
	}

	me.iterator = function(){
		var I = 0, profs = this.__profs, fields = arguments;

		var next = function(){
			if(I < profs.length){
				if(!profs[I].takeMe()){
					var outobj = {};
					for (var i = 0; i < fields.length; i++) {
						var field = profs[I].getField(fields[i]);
						outobj[fields[i]] = field;
					}

					I++;
					return outobj;
				}else{
					I++;
					return next();
				}
			}else return false;
		}

		return next;
	}

	return me;
}());

module.exports = ProfileList;
