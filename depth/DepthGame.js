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
};

depth.DepthGame.prototype.init = function(){
	console.log("init");
	var self = this;


	this.canvas = document.getElementById(this.options.canvasID);
	this.engine = new BABYLON.Engine(this.canvas, this.options.antialias);

	Input.init(this.canvas);

	BABYLON.Tools.RegisterTopRootEvents([
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

depth.DepthGame.prototype.update = function(){

	if(Input.getKeyDown(KeyCode.RETURN)){
		console.log("down enter");
		Input.lockCursor(true);
	}

	if(Input.getKeyUp(KeyCode.RETURN)){
		console.log("up enter");
	}

	this.cube.rotation.x += 0.005 * Input.getMouseDelta().y;
	this.cube.rotation.y += 0.005 * Input.getMouseDelta().x;

	if(Input.getKey(KeyCode.COMMA)){
		this.cube.rotation.x += 0.05;
	}

	if(Input.getKey(KeyCode.O)){
		this.cube.rotation.x -= 0.05;
	}

	if(Input.getKey(KeyCode.A)){
		this.cube.rotation.y += 0.05;
	}

	if(Input.getKey(KeyCode.E)){
		this.cube.rotation.y -= 0.05;
	}

	Input.endFrame();
};

depth.DepthGame.prototype.render = function(){
	this.scene.render();
};
