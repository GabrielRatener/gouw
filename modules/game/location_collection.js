var
	Stone = require('./stone.js'),
	Empty = require('./empty.js'),
	StoneGroup = require('./stone_group.js'),
	EmptyGroup = require('./empty_group.js'),


	prototype = require('./prototypes/collection.js');

function LocationCollection(){
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

LocationCollection.prototype = (function(){
	var me = Object.create(prototype);

	me.add = function(place){
		if (place instanceof StoneGroup || place instanceof EmptyGroup){
			var
				pto,
				next = place.memberIterator();
			while(pto = next()){
				this.add(pto);
			}
		}else if(place instanceof Stone || place instanceof Empty){
			var n = place.placeNumber();
			this._thingHash[n] = place;
		}else return false;
	}

	me.iterator = function(){
		var
			i = 0,
			o = {};

		o.hasNext = function(){
			return (i < this._thingHash.length);
		}

		o.next = function(){
			i += 1;
			return [i - 1];
		}

		return o;
	}

	me.toGroupCollection = function(){
		var
			iterator = this.iterator(),
			gc = new GroupCollection();

		while(iterator.hasNext()){
			gc.add(iterator.next());
		}

		return gc;
	}

	me.query = function(type, negate){
		var 
			keys = Object.keys(this._thingHash),
			list = [];
		if(type === undefined){
			for(var i = 0; i < keys.length; i++){
				list.push(this._thingHash[keys[i]]);
			}
		}else{
			for(var i = 0; i < keys.length; i++){
				if((this._thingHash[keys[i]].is() === type) === !negate){
					list.push(this._thingHash[keys[i]]);
				}
			}			
		}

		return list;
	}

	return me;
}());

module.exports = LocationCollection;