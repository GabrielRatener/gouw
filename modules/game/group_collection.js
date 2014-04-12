var
	prototype = require('./prototypes/collection.js');

function GroupCollection(){
	this._thingHash = {};

	if( arguments.length > 0 ){
		if(arguments.length === 1){
			if (arguments[0] instanceof Array){
				for (var i = 0; i < arguments[0].length; i++) {
					this.add(arguments[0][i]);
				};
			}else{
				this.add(arguments[0]);
			}
		}else{
			for (var i = 0; i < arguments.length; i++) {
				this.add(arguments[i]);
			};
		}
	}
}

GroupCollection.prototype = (function(){
	var me = Object.create(prototype);

	me.add = function(group){
		var type = group.metatype();
		if(type === 99){
			var id = group.id;
			if(!id) return false;
			this._thingHash[id] = group;
		}else if(type === 9){
			var id = group.group.id;
			if(!id) return false;
			this._thingHash[id] = group.group;
		}else return false;

		return true;
	}

	me.largest = function(type, negate){
		var 
			biggest,
			keys = this._thingHash.keyIterator(),
			max = 0;

		if (type === undefined){
			while(keys.hasNext()){
				var 
					group = this._thingHash[keys.next()],
					size = group.size();
				if (size > max){
					max = size;
					biggest = group;
				}
			}
		}else{
			while(keys.hasNext()){
				var 
					group = this._thingHash[keys.next()],
					size = group.size();
				if (size > max && (group.is() === type) === !negate){
					max = size;
					biggest = group;
				}
			}
		}

		return biggest;
	}

	me.smallest = function(type){
		var 
			min,
			smallest,
			keys = this._thingHash.keyIterator();

		if (type === undefined){
			while(keys.hasNext()){
				var 
					group = this._thingHash[keys.next()],
					size = group.size();
				if (min === undefined || size < min){
					min = size;
					smallest = group;
				}
			}
		}else{
			while(keys.hasNext()){
				var 
					group = this._thingHash[keys.next()],
					size = group.size();
				if ((min === undefined || size < min) && (group.is() === type) === !negate){
					min = size;
					smallest = group;
				}
			}
		}

		return smallest;
	}

	me.toLocationCollection = function(){
		var
			iterator = this.iterator(),
			lc = new LocationCollection();
		while(iterator.hasNext()){
			lc.add(iterator.next());
		}

		return lc;
	}

	return me;
}());

module.exports = GroupCollection;