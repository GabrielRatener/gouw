function Board(container, params){
	container.innerHTML = "";

	this.__container = container;
	this.__params = params;


	var board = [];
	for(var i = 0; i < params.size[0]; i++){
		board.push([]);
		for(var j = 0; j < params.size[1]; j++){
			board[i].push(false);
		}
	}
	this.__board = board;

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
	this.__layers = layers;

	this.__dimensions = [false, false];
	this.__spaces = params.size;

	layers[2].element.onmousemove = function(e){
		var rect = this.getBoundingClientRect();
		thiss.__over({
			"x": e.clientX - rect.left,
			"y": e.clientY - rect.top
		});
	}

	layers[2].element.onclick = function(e){
		var rect = this.getBoundingClientRect();
		thiss.__clicked({
			"x": e.clientX - rect.left,
			"y": e.clientY - rect.top
		});
	}

	this.__last = false;

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

	me.__clear = function(pt, layer){
		if(pt) {
			var w = this.__dimensions[0] / this.__spaces[0],
				h = this.__dimensions[1] / this.__spaces[1],
				x0 = pt[0] * w,
				y0 = pt[1] * h,
				xf = (pt[0] + 1) * w,
				yf = (pt[1] + 1) * h;

			this.__layers[layer].context.clearRect(x0, y0, xf, yf);
		}else return false;
	}

	me.__over = function(ev){
		var dims = this.__dimensions;

		var x = Math.floor(this.__spaces[0] * ev.x / dims[0]),
			y = Math.floor(this.__spaces[1] * ev.y / dims[1]);

		if(x >= dims[0]) x = dims[0] - 1;
		if(y >= dims[0]) y = dims[0] - 1;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		var now = [x, y],
			las = this.__last;
		if(now !== las){
			// todo: clear last
			if(!!las && !this.__board[las[0]][las[1]]){
				this.__clear(this.__last, 2);				
			}

			this.__last = now;
			this.ontilehover(now);
		}
	}

	me.__clicked = function(ev){
		var dims = this.__dimensions;

		var x = Math.floor(this.__spaces[0] * ev.x / dims[0]),
			y = Math.floor(this.__spaces[1] * ev.y / dims[1]);

		if(x >= dims[0]) x = dims[0] - 1;
		if(y >= dims[0]) y = dims[0] - 1;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		this.ontileclick([
			x,
			y
		]);
	}

	me.__dot = function(pt){
		var w = this.__dimensions[0] / this.__spaces[0],
			h = this.__dimensions[1] / this.__spaces[1],
			x = (pt[0] + 0.5) * w,
			y = (pt[1] + 0.5) * h,
			r = 0.1 * Math.min(w, h),
			cc = this.__layers[0].context;

		cc.fillStyle = "#000";
		cc.beginPath();
		cc.arc(x, y, r, 0, 2 * Math.PI);
		cc.closePath();
		cc.fill();
	}

	me.__circle = function(pt, color, layer){
		var w = this.__dimensions[0] / this.__spaces[0],
			h = this.__dimensions[1] / this.__spaces[1],
			x = (pt[0] + 0.5) * w,
			y = (pt[1] + 0.5) * h,
			r = 0.45 * Math.min(w, h),
			cc = this.__layers[layer].context;

		this.__clear(pt, layer);
		cc.fillStyle = color;
		cc.beginPath();
		cc.arc(x, y, r, 0, 2 * Math.PI);
		cc.closePath();
		cc.fill();
	}

	me.play = function(pt, color){
		var bow = (!!color) ? "#FFF" : "#000";
		this.__board[pt[0]][pt[1]] = true;
		this.__circle(pt, bow, 1);
	}

	me.putGhost = function(pt, color){
		if(color === undefined){
			color = this.__color;
		}
		var bow = (!!color) ? "rgba(255,255,255, 0.5)" : "rgba(0,0,0,0.5)";
		this.__circle(pt, bow, 2);
	}

	me.remove = function(places){
		for (var i = 0; i < places.length; i++) {
			var pt = places[i];

			this.__board[pt[0]][pt[1]] = false;
			this.__clear(pt, 1);
		}
	}

	me.resetCanvas = function(){
		width = this.__container.clientWidth;
		height = this.__container.clientHeight;

		for(var i = 0; i < 3; i++){
			var layer = this.__layers[i].element;
			
			layer.setAttribute("width", width);
			layer.setAttribute("height", height);

			var context = layer.getContext("2d");
			context.clearRect(0, 0, width, height);
			this.__layers[i].context = context;
		}

		var bottom = this.__layers[0].context;

		var hn = this.__spaces[0],
			vn = this.__spaces[1];

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

		this.__dimensions = [width, height];

		if(stars.hasOwnProperty(hn + "x" + vn)){
			var dots = stars[hn + "x" + vn];
			for (var i = 0; i < dots.length; i++) {
				for(var j = 0; j < dots.length; j++){
					var pt = [
						dots[i],
						dots[j]
					];

					this.__dot(pt);
				}
			}
		}
	}

	return me;
}());