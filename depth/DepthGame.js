var depth = depth || {};

depth.DepthGame = function(options){
	var self = this;

	options = options || {};
	options.canvasID = options.canvasID || "renderCanvas";
	options.antialias = options.antialias || false;
	this.options = options;

	this.canvas = null;
	this.engine = null;

	this.scene = null;
	this.camera = null;
	this.cube = null;

	this.input = {
		up : false,
		down : false,
		left : false,
		right : false,

		mouse : {
			x : 0,
			y : 0
		}
	};
};

depth.DepthGame.prototype.init = function(){
	console.log("init");
	var self = this;

	this.canvas = document.getElementById(this.options.canvasID);
	this.engine = new BABYLON.Engine(this.canvas, this.options.antialias);

	BABYLON.Tools.RegisterTopRootEvents([
		{
			name: "keydown",
			handler: function(evt){ self._onKeyDown(evt);}
		},
		{
			name: "keyup",
			handler: function(evt){ self._onKeyUp(evt);}
		},
		{
			name: "resize",
			handler: function(){ self.engine.resize(); }
		}
	]);

	// init scene
	this.scene = new BABYLON.Scene(this.engine);
	this.scene.clearColor = new BABYLON.Color3(0,0,0);

	this.camera = new BABYLON.Camera("Camera", BABYLON.Vector3.Zero(), this.scene);
	this.camera.attachControl(this.canvas, false);

	this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
	this.light.intensity = 0.5;

	this.cube = new BABYLON.Mesh.CreateBox("box", 1, this.scene);
	this.cube.position.z = 10;
};

depth.DepthGame.prototype.start = function(){
	console.log("start");
	var self = this;

	this.engine.runRenderLoop(function(){
		self.update();
		self.render();
	});
};

depth.DepthGame.prototype._onKeyDown = function(evt){
	console.log('down '+evt.keyCode);
	if(evt.keyCode == KeyCode.COMMA){
		this.input.up = true;
	}

	if(evt.keyCode == KeyCode.O){
		this.input.down = true;
	}

	if(evt.keyCode == KeyCode.A){
		this.input.left = true;
	}

	if(evt.keyCode == KeyCode.E){
		this.input.right = true;
	}
};

depth.DepthGame.prototype._onKeyUp = function(evt){
	console.log('up '+evt.keyCode);

	if(evt.keyCode == KeyCode.COMMA){
		this.input.up = false;
	}

	if(evt.keyCode == KeyCode.O){
		this.input.down = false;
	}

	if(evt.keyCode == KeyCode.A){
		this.input.left = false;
	}

	if(evt.keyCode == KeyCode.E){
		this.input.right = false;
	}
};

depth.DepthGame.prototype.update = function(){
	if(this.input.up){
		this.cube.rotation.x += 0.05;
	}

	if(this.input.down){
		this.cube.rotation.x -= 0.05;
	}

	if(this.input.left){
		this.cube.rotation.y += 0.05;
	}

	if(this.input.right){
		this.cube.rotation.y -= 0.05;
	}

	// reset input
};

depth.DepthGame.prototype.render = function(){
	this.scene.render();
};
