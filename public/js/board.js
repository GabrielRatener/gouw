function Board(container, params){
	container.innerHTML = "";

	this._container = container;
	this._params = params;


	var board = [];
	for(var i = 0; i < params.size[0]; i++){
		board.push([]);
		for(var j = 0; j < params.size[1]; j++){
			board[i].push(false);
		}
	}
	this._board = board;

	var clas = (container.getAttribute("class") || "") + " board_container";
	container.setAttribute("class", clas);

	var layers = [];
	for(var i = 0; i < 3; i++){
		var layer = document.createElement("canvas");
		container.appendChild(layer);

		layers.push({
			"context": false,
			"element": layer
		});
	}
	this._layers = layers;

	this._dimensions = [false, false];
	this._spaces = params.size;

	layers[2].element.onmousemove = function(e){
		var rect = this.getBoundingClientRect();
		thiss._over({
			"x": e.clientX - rect.left,
			"y": e.clientY - rect.top
		});
	}

	layers[2].element.onclick = function(e){
		var rect = this.getBoundingClientRect();
		thiss._clicked({
			"x": e.clientX - rect.left,
			"y": e.clientY - rect.top
		});
	}

	this._last = false;

	this.ontilehover = function(){};
	this.ontileclick = function(){};

	var thiss = this;

	this.resetCanvas();
}

Board.prototype = (function(){
	var me = {};

	var stars = {

		// triples' values represent both x, and y star positions
		"9x9": [2, 4, 6],
		"13x13": [2, 6, 10],
		"19x19": [3, 9, 15]
	};

	me._clear = function(pt, layer){

		if(pt) {
			var w = this._dimensions[0] / this._spaces[0],
				h = this._dimensions[1] / this._spaces[1],
				x = pt[0] * w,
				y = pt[1] * h;

			this._layers[layer].context.clearRect(x, y, w, h);
		}else return false;
	}

	me._over = function(ev){
		var dims = this._dimensions;

		var x = Math.floor(this._spaces[0] * ev.x / dims[0]),
			y = Math.floor(this._spaces[1] * ev.y / dims[1]);

		if(x >= dims[0]) x = dims[0] - 1;
		if(y >= dims[1]) y = dims[1] - 1;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		var now = [x, y],
			las = this._last;
		if(now !== las){
			this._clear(this._last, 2);				

			this._last = now;
			this.ontilehover(now);
		}
	}

	me._clicked = function(ev){
		var dims = this._dimensions;

		var x = Math.floor(this._spaces[0] * ev.x / dims[0]),
			y = Math.floor(this._spaces[1] * ev.y / dims[1]);

		if(x >= dims[0]) x = dims[0] - 1;
		if(y >= dims[1]) y = dims[1] - 1;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		this.ontileclick([
			x,
			y
		]);
	}

	me._dot = function(pt){
		var w = this._dimensions[0] / this._spaces[0],
			h = this._dimensions[1] / this._spaces[1],
			x = (pt[0] + 0.5) * w,
			y = (pt[1] + 0.5) * h,
			r = 0.1 * Math.min(w, h),
			cc = this._layers[0].context;

		cc.fillStyle = "#000";
		cc.beginPath();
		cc.arc(x, y, r, 0, 2 * Math.PI);
		cc.closePath();
		cc.fill();
	}

	me._circle = function(pt, color, layer){
		var w = this._dimensions[0] / this._spaces[0],
			h = this._dimensions[1] / this._spaces[1],
			x = (pt[0] + 0.5) * w,
			y = (pt[1] + 0.5) * h,
			r = 0.45 * Math.min(w, h),
			cc = this._layers[layer].context;


		this._clear(pt, layer);
		cc.fillStyle = color;
		cc.beginPath();
		cc.arc(x, y, r, 0, 2 * Math.PI);
		cc.closePath();
		cc.fill();
	}

	me.play = function(pt, color){
		var bow = (!!color) ? "#FFF" : "#000";
		this._board[pt[0]][pt[1]] = true;
		this._circle(pt, bow, 1);
	}

	me.putGhost = function(pt, color){
		if(color === undefined){
			color = this._color;
		}
		var bow = (!!color) ? "rgba(255,255,255, 0.5)" : "rgba(0,0,0,0.5)";
		this._circle(pt, bow, 2);
	}

	me.putStones = function(color, array){
		for(var i = 0; i < array.length; i++){
			this.play(array[i], color);
		}

		return true;
	}

	me.remove = function(places){
		for (var i = 0; i < places.length; i++) {
			var pt = places[i];

			this._board[pt[0]][pt[1]] = false;
			this._clear(pt, 1);
		}
	}

	me.resetCanvas = function(){
		width = this._container.clientWidth;
		height = this._container.clientHeight;

		for(var i = 0; i < 3; i++){
			var layer = this._layers[i].element;
			
			layer.setAttribute("width", width);
			layer.setAttribute("height", height);

			var context = layer.getContext("2d");
			context.clearRect(0, 0, width, height);
			this._layers[i].context = context;
		}

		var bottom = this._layers[0].context;

		var hn = this._spaces[0],
			vn = this._spaces[1];

		var hspace = width / hn,
			vspace = height / vn;
		bottom.beginPath();
		for(var i = 0; i < hn; i++){
			var x = (i + 0.5) * hspace,
				y1 = 0.5 * vspace,
				y2 = (vn - 0.5) * vspace;

			bottom.moveTo(x, y1);
			bottom.lineTo(x, y2);
		}
		for(var i = 0; i < vn; i++){
			var y = (i + 0.5) * vspace,
				x1 = 0.5 * hspace,
				x2 = (hn - 0.5) * hspace;

			bottom.moveTo(x1, y);
			bottom.lineTo(x2, y);
		}
		bottom.stroke();

		this._dimensions = [width, height];

		if(stars.hasOwnProperty(hn + "x" + vn)){
			var dots = stars[hn + "x" + vn];
			for (var i = 0; i < dots.length; i++){
				for(var j = 0; j < dots.length; j++){
					var pt = [
						dots[i],
						dots[j]
					];

					this._dot(pt);
				}
			}
		}
	}

	return me;
}());