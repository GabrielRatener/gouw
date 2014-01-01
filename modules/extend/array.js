Array.prototype.process = function(func){
	var rett = [];
	for (var i = 0; i < this.length; i++) {
		rett.push(func(this[i]));
	}

	return rett;
}

Array.prototype.contains2 = function(){

	for (var i = 0; i < this.length; i++) {
		for(var j = 0; j < arguments.length; j++){
			if(this[i] == arguments[j]) return true;		
		}
	}

	return false;
}

// using === therefore gennerally better
Array.prototype.contains = function(){

	for (var i = 0; i < this.length; i++) {
		for(var j = 0; j < arguments.length; j++){
			if(this[i] === arguments[j]) return true;				
		}
	}

	return false;
}

Array.prototype.unique = function(func){
	var fun = func || give;
	var i = 0, passed = [];
	while(i < this.length){
		var rep = fun(this[i]);
		if(rep in passed){
			this.splice(i, 1);
		}else{
			passed.push(rep);
			i += 1;
		}
	}
}

Array.prototype.clean = function(){
	var args = [];
	for (var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	var i = 0;
	while(i < this.length){
		if(args.contains(this[i])){
			this.splice(i, 1);
		}else i++;
	}
}

Array.prototype.histogram = function(){
	var obj = {};

	for (var i = 0; i < this.length; i++) {
		if(obj.hasOwnProperty(this[i])){
			obj[this[i]]++;
		}else{
			obj[this[i]] = 1;
		}
	}

	return obj;
}

// Yay, recursion!!!
// for use with array of objects (no falsy values)
Array.prototype.iterator = function(filtre){
	var i = 0, arr = this,
		filter = filtre || function(val){return true;};
	var next = function(){
		if(i >= arr.length){
			return false;
		}else{
			var val = arr[i];
			i += 1;
			if(filter(val)){
				return val;
			}else return next();
		}
	}

	return next;
}

Array.prototype.expanded = function(func){
	var arry = [];
	for (var i = 0; i < this.length; i++) {
		var suba = func(this[i]);
		arry.concat(suba);
	}

	return arry;
}

Array.prototype.is = function(arr){
	if(arr.length !== this.length) return false;

	for(var i = 0; i < this.length; i++){
		if(arr[i] !== this[i]){
			return false;
		}
	}

	return true;
}

Array.prototype.is2 = function(arr){
	if(arr.length !== this.length) return false;

	for(var i = 0; i < this.length; i++){
		if(arr[i] != this[i]){
			return false;
		}
	}

	return true;
}
