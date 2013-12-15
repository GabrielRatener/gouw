

function ProfilePair(p1, p1){
	this.__array = [p1, p2];
	
	this.__hash = {};
	this.__hash[p1.uid] = p1;
	this.__hash[p2.uid] = p2;
}

ProfilePair.prototype = (function(){
	var me = {};

	me.send = function(evt, data){
		this.__array.foreach(function(item){
			item.send(evt, data);
		});
	}

	me.on = function(evt, func){
		this.__array.foreach(function(item){
			item.on(evt, function(data){
				func(data, item.uid);
			});
		});
	}

	me.off = function(evt){
	
		this.__array.foreach(function(item){
			item.off(evt);
		});
	}

	me.byUid = function(id){
		return this.__hash[id];
	}

	me.byNotUid = function(id){
		if(this.__array[0].uid === id){
			return this.__array[1];
		}else return this.__array[0];
	}

	return me;
}());