module.exports = (function(){
	var me = {};

	me.remove = function(thing){

		if(!(thing instanceof String)){
			var id = thing.id;
		}else{
			var id = thing;
		}

		delete this._thingHash[id];
	}

	me.query = function(type, negate){
		var 
			things = [],
			keys = this._thingHash.keyIterator();
		if(type === undefined){
			while(keys.hasNext()){
				var k = keys.next();
				things.push(this._thingHash[k]);
			}
		}else{
			while(keys.hasNext()){
				var 
					k = keys.next(),
					g = this._thingHash[k];
				if((g.is() === type) === !negate){
					things.push(g);
				}
			}
		}

		return things;
	}

	me.count = function(type, negate){
		var 
			i = 0,
			keys = this._thingHash.keyIterator();

		if(type === undefined){
			return Object(this._thingHash).length;
		}else{
			while(keys.hasNext()){
				var k = keys.next();
				if((this._thingHash[k].is() === type) === !negate){
					i += 1;
				}
			}

			return i;
		}
	}

	me.iterator = function(type, negate){
		var 
			i = 0,
			o = {},
			a = this.query(type, negate);

		o.hasNext = function(){
			return (i < a.length);
		}

		o.next = function(){
			i += 1;
			return a[i - 1];
		}

		return o;
	}

	me.overlap = function(c2, type, negate){
		var 
			iter = c2.iterator(type, negate),
			collection = this.constructor();

		while (iter.hasNext()) {
			var it = iter.next();
			if(this.isin(it)){
				collection.add(it);
			}
		}

		return collection;
	}

	me.isin = function(god){
		if (god instanceof String){
			return this._thingHash.hasOwnProperty(god);
		}else{
			return this._thingHash.hasOwnProperty(god.id);
		}
	}

	return me;
}());