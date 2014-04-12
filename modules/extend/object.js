
Object.prototype.clone = function(deep){
	if(this instanceof Array){
		var nua = [];
		for(var i = 0; i < nua.length; i++){
			if(deep && nua[i] instanceof Object){
				nua[i] = this[i].clone(true);
			}else{
				nua[i] = this[i];
			}
		}

		return nua;
	}else{
		var nu = {};
		for(var key in this){
			if(deep && this[k] instanceof Object){
				nu[k] = this[k].clone(true);
			}else{
				nu[k] = this[k];
			}
		}

		return nu;
	}
}

Object.prototype.keyIterator = function(){
	var 
		i = 0,
		keys = Object.keys(this),
		iterator = {};

	iterator.hasNext = function(){
		return (i < keys.length);
	}

	iterator.next = function(){
		i += 1;
		return keys[i - 1];
	}

	return iterator;
}

// works in virtual machines -> for debugging
Object.prototype.instanceOf = function(functi){
	return (Object.getPrototypeOf(this) === functi.prototype);
}

Object.prototype.metatype = function(){
	return 0;
}