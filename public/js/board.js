function Board(container, params){
	var thiss = this;

	this.__container = container;
	this.__params = params;

	var clas = (container.getAttribute("class") || "") + " board_container";
	container.setAttribute("class", clas);

	var canvas = document.createElement("canvas");
	container.appendChild(canvas);

	var board = document.createElement("canvas");
	container.appendChild(board);

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
		var rect = this.getBoundingClientRect();
		thiss.over({
			"x": e.clientX - rect.left,
			"y": e.clientY - rect.top
		});
	}

	canvas.onclick = function(e){
		var rect = this.getBoundingClientRect();
		thiss.clicked({
			"x": e.clientX - rect.left,
			"y": e.clientY - rect.top
		});
	}

	this.__last = false;

	this.resetCanvas();
}

Board.prototype = (function(){
	var me = {};

	me.over = function(){
		
	}

	me.clicked = function(){

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