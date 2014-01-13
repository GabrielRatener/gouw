

function ProfilePair(p1, p2){
	this._array = [p1, p2];
	
	this._hash = {};
	this._hash[p1.uid] = p1;
	this._hash[p2.uid] = p2;
}

ProfilePair.prototype = (function(){
	var me = {
		get p1(){
			return this._array[0];
		},
		set p1(val){
			console.log("read only property");
		},


		get p2(){
			return this._array[1];
		},
		set p2(val){
			console.log("read only property");
		}
	};

	me.send = function(evt, data){
		this._array.forEach(function(item){
			item.send(evt, data);
		});
	}

	me.on = function(evt, func){
		this._array.forEach(function(item){
			item.on(evt, function(data){
				func(data, item.uid);
			});
		});
	}

	me.off = function(evt){
	
		this._array.forEach(function(item){
			item.off(evt);
		});
	}

	me.byUid = function(id){
		if(this._array[1].uid === id){
			return this._array[1];
		}else return this._array[0];
	}

	me.byNotUid = function(id){
		if(this._array[0].uid === id){
			return this._array[1];
		}else return this._array[0];
	}

	return me;
}());

module.exports = ProfilePair;