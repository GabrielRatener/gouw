function Board(container, params){

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


	var board = document.createElement("canvas");
	container.appendChild(board);

	var canvas = document.createElement("canvas");
	container.appendChild(canvas);

	this.__back = {
		"context": false,
		"element": board
	};
	this.__front = {
		"context": false,
		"element": canvas
	};

	this.__dimensions = [false, false];
	this.__spaces = params.size;

	canvas.onmousemove = function(e){
		var rect = canvas.getBoundingClientRect();
		thiss.__over({
			"x": e.clientX - rect.left,
			"y": e.clientY - rect.top
		});
	}

	canvas.onclick = function(e){
		var rect = canvas.getBoundingClientRect();
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

	me.__clear = function(pt){
		if(pt) {
			var w = this.__dimensions[0] / this.__spaces[0],
				h = this.__dimensions[1] / this.__spaces[1],
				x0 = pt[0] * w,
				y0 = pt[1] * h,
				xf = (pt[0] + 1) * w,
				yf = (pt[1] + 1) * h;

			this.__front.context.clearRect(x0, y0, xf, yf);
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
				this.__clear(this.__last);				
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

	me.__circle = function(pt, color){
		var w = this.__dimensions[0] / this.__spaces[0],
			h = this.__dimensions[1] / this.__spaces[1],
			x = (pt[0] + 0.5) * w,
			y = (pt[1] + 0.5) * h,
			r = 0.45 * Math.min(w, h),
			cc = this.__front.context;

		cc.fillStyle = color;
		cc.beginPath();
		cc.arc(x, y, r, 0, 2 * Math.PI);
		cc.closePath();
		cc.fill();
	}

	me.putStone = function(pt, color){
		var bow = (!!color) ? "#FFF" : "#000";
		this.__board[pt[0]][pt[1]] = true;
		this.__circle(pt, bow);
	}

	me.putGhost = function(pt, color){
		var bow = (!!color) ? "rgba(255,255,255, 0.5)" : "rgba(0,0,0,0.5)";
		this.__circle(pt, bow);
	}

	me.resetCanvas = function(){
		width = this.__container.clientWidth;
		height = this.__container.clientHeight;

		var board = this.__back.element,
			canvas = this.__front.element;

		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);

		board.setAttribute("width", width);
		board.setAttribute("height", height);

		var bc = this.__back.context = board.getContext("2d");
		var cc = this.__front.context = canvas.getContext("2d");

		bc.clearRect(0, 0, width, height);
		var hn = this.__spaces[0],
			vn = this.__spaces[1];

		var hspace = width / hn,
			vspace = height / vn;
		bc.beginPath();
		for(var i = 0; i < hn; i++){
			var x = (i + 0.5) * hspace,
				y1 = 0.5 * vspace,
				y2 = (vn - 0.5) * vspace;

			bc.moveTo(x, y1);
			bc.lineTo(x, y2);
		}
		for(var i = 0; i < vn; i++){
			var y = (i + 0.5) * vspace,
				x1 = 0.5 * hspace,
				x2 = (hn - 0.5) * hspace;

			bc.moveTo(x1, y);
			bc.lineTo(x2, y);
		}
		bc.stroke();

		this.__dimensions = [width, height];
	}

	return me;
}());