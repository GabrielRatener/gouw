function Board(container, params){
	/*
	dev notes:

	the term tile is used to reffer to a rectangle with the same dimensions as the squares on the board but centered over an intersection.
	
	all methods and variables starting with '_' should only be used internally, except for testing.

	this module uses cartesian coordinates for points as arrays of length 2:
	 [x, y], starting from the upper left, so y is downward.

	when using matrix notation i represents y, and j represents x so one must use [j, i] to represent the coordinate correctly.

	for use as keys in hash tables and other cases in which arrays are not suitable please represent positions by their point number, which should be obtained by using the _placeNumber method, conversely, it is sometimes useful to translate a place number back to an array[2], in which case you should use _numberPlace(), here is common usage:

		var placeNumber = this._placeNumber([5, 7]) 	<- returns 38
		var placeArray = this._numberPlace(placeNumber)	<- returns [5, 7]

	painter methods such as _square and _circle should only be used internally to update the view. Public methods must update the model and the view
	*/

	// clear container
	container.innerHTML = "";

	this._container = container;
	this._params = params;

	// initialize board
	var board = [];
	for(var i = 0; i < params.size[0]; i++){
		board.push([]);
		for(var j = 0; j < params.size[1]; j++){
			board[i].push(false);
		}
	}
	// used to keep track of game state
	this._board = board;
	this._stoneHash = {};
	this._lastMove = {
		"color": false,
		"point": false
	};


	var clas = (container.getAttribute("class") || "") + " board_container";
	container.setAttribute("class", clas);

	this._layerNumber = 4;
	var layers = [];
	for(var i = 0; i < this._layerNumber; i++){
		var layer = document.createElement("canvas");
		container.appendChild(layer);

		layers.push({
			// context gets set in resetCanvas
			"context": false,
			"element": layer
		});
	}
	this._layers = layers;

	// actual spacial dimensions of board
	this._dimensions = [false, false];
	//	number of spaces
	this._spaces = params.size;

	this._last = false;	// so ontilehover only fires when over new tile
	layers[this._layerNumber - 1].element.onmousemove = function(e){
		var rect = this.getBoundingClientRect();
		thiss._over([
			e.clientX - rect.left,
			e.clientY - rect.top
		]);
	}

	layers[this._layerNumber - 1].element.onclick = function(e){
		var rect = this.getBoundingClientRect();
		thiss._clicked([
			e.clientX - rect.left,
			e.clientY - rect.top
		]);
	}

	// interface
	this.ontilehover = function(){};
	this.ontileclick = function(){};

	// add unambiguous reference to instance and initialize canvas
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

	// set layer array positions on board
	var
		GRID = 0,
		STONES = 1,
		LAST_PLAY = 2,
		GHOSTS = 3;

	/*
	gets game state as string, linearized by row from the top.
	*/
	me._getGameState = function(){
		var string = "",
			empty = true;

		// using matrix notation: i is vertical, j is horizontal
		for (var i = 0; i < this._spaces[0]; i++){
			for (var j = 0; j < this._spaces[1]; j++){
				var pn = this._placeNumber([j, i]);
				if(this._stoneHash.hasOwnProperty(pn)){
					if (empty){
						empty = false;				
					}
					string += this._stoneHash[pn].toString();
				}else{
					string += "5";
				}
			}
		}

		if (empty) return false;
		else return string;
	}

	// erases tile
	me._clear = function(pt, layer){

		if(pt) {
			var w = this._dimensions[0] / this._spaces[0],
				h = this._dimensions[1] / this._spaces[1],
				x = pt[0] * w,
				y = pt[1] * h;

			this._layers[layer].context.clearRect(x, y, w, h);
			return true;
		}else return false;
	}

	me._clearLayer = function(l){
		var w = this._dimensions[0],
			h = this._dimensions[1];

		this._layers[l].context.clearRect(0,0, w, h);
		return true;
	}

	me._over = function(ev){
		var dims = this._dimensions,
			layer = GHOSTS;

		var x = Math.floor(this._spaces[0] * ev[0] / dims[0]),
			y = Math.floor(this._spaces[1] * ev[1] / dims[1]);

		if(x >= dims[0]) x = dims[0] - 1;
		if(y >= dims[1]) y = dims[1] - 1;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		var now = [x, y],
			las = this._last;
		if(now !== las){
			this._clear(this._last, layer);				

			this._last = now;
			this.ontilehover(now);
		}
	}

	me._clicked = function(ev){
		var dims = this._dimensions;

		var x = Math.floor(this._spaces[0] * ev[0] / dims[0]),
			y = Math.floor(this._spaces[1] * ev[1] / dims[1]);

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
			cc = this._layers[GRID].context;

		cc.fillStyle = "#000";
		cc.beginPath();
		cc.arc(x, y, r, GRID, 2 * Math.PI);
		cc.closePath();
		cc.fill();
	}


	me._circle = function(pt, color, layer){
		var
			w = this._dimensions[0] / this._spaces[0],
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

	me._square = function(pt, color, layer){
		var 
			r = 0.25,
			w = this._dimensions[0] / this._spaces[0],
			h = this._dimensions[1] / this._spaces[1],
			x1 = (pt[0] + 0.5 - r) * w,
			y1 = (pt[1] + 0.5 - r) * h,
			x2 = (pt[0] + 0.5 + r) * w,
			y2 = (pt[1] + 0.5 + r) * h,
			cc = this._layers[layer].context;

		this._clear(pt, layer);
		cc.beginPath();
		cc.strokeStyle = color;
		cc.rect(x1, y1, x2 - x1, y2 - y1);
		cc.stroke();
	}

	// simply puts stone on board (subset of play)
	me._putStone = function(pt, col){
		var 
			n = this._placeNumber(pt),
			c = (col) ? "#fff" : "000";
		this._circle(pt, c, STONES);	// puts stone on board
		this._stoneHash[n] = col;
	}

	me._placeNumber = function(pt){
		return pt[1] * this._spaces[0] + pt[0];
	}

	me._numberPlace = function(n){
		var
			x = n % this._spaces[0],
			y = Math.floor(n / this._spaces[1]);

		return [
			x,
			y
		];
	}

	me.clearBoard = function(){
		return this._clearLayer(STONES);
	}

	// puts stone on board and takes indicates move
	me.play = function(pt, col){
		var 
			oc = (!col) ? "#FFF" : "#000",
			pp = this._lastMove.point;
		this._clear(pp, LAST_PLAY);
		this._putStone(pt, col);
		this._square(pt, oc, LAST_PLAY);	// puts square over stone of opposite color to indicate play
		this._lastMove.color = col;
		this._lastMove.point = pt;
	}

	me.putGhost = function(pt, col){
		if(col === undefined){
			col = this._color;
		}
		var color = (!!col) ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
			ln = GHOSTS;
		this._circle(pt, color, ln);
	}

	me.putStones = function(col, array){
		for(var i = 0; i < array.length; i++){
			this._putStone(array[i], col);
		}

		return true;
	}

	me.remove = function(places){
		var layer = STONES;
		for (var i = 0; i < places.length; i++) {
			var pt = places[i];

			this._clear(pt, layer);

			var n = this._placeNumber(pt);
			delete this._stoneHash[n];
		}
	}

	me.destroy = function(){
		this._container.innerHTML = "";
	}

	me.projectGameImage = function(sora, last){
		var width = this._spaces[0],
			height = this._spaces[1],
			sl = STONES;

		if (sora instanceof Array){
			if (sora.length > 0 &&
				sora.length === width &&
				sora[0].length === height){

				for (var i = 0; i < sora.length; i++) {
					for (var j = 0; j < sora[i].length; j++) {
						var n = parseInt(sora[i][j]);
						if(n === 5){
							this._clear([i, j], sl);
						}else{
							this._circle([x, y], sl, n);
						}
					}
				}
			}else{
				return false;
			}
		}else{
			if (sora.length === width * height){
				for (var i = 0; i < sora.length; i++) {
					var 
						n = parseInt(sora[i], 10),
						pt = this._numberPlace(i),
						x = pt[0],
						y = pt[1],
						c1 = (!!n) ? "#fff" : "#000",
						c2 = (!n) ? "#fff" : "#000";
					
					if(n === 5){
						this._clear([x, y], sl);
					}else{
						this._circle([x, y], c1, sl);
					}
				}
			}else{
				return false;
			}
		}

		if (last){
			var 
				col = (!!last.color) ? "#000" : "#fff",
				point = last.point;
			this._square(point, col, LAST_PLAY);
		}

		return true;
	}


	/*
	call this after changing the container size (that's how you should resize the board). this will make all necessary adjustments. also called internally to initialize canvas
	*/
	me.resetCanvas = function(){
		var
			width = this._container.clientWidth,
			height = this._container.clientHeight;

		for(var i = 0; i < this._layerNumber; i++){
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

		var game = this._getGameState();
		if(game){
			this.projectGameImage(game, this._lastMove);
		}
	}

	return me;
}());