var depth = depth || {};

depth.DepthGame = function(options){
	options = options || {};
	options.canvasID = options.canvasID || "renderCanvas";
	options.antialias = options.antialias || false;
	this.options = options;

	this.canvas = null;
	this.engine = null;

	this.scene = null;
	this.camera = null;
	this.cube = null;

	this.ground = null;
	this.player = null;
};

depth.DepthGame.prototype.init = function(){
	console.log("init");
	var self = this;

	this.canvas = document.getElementById(this.options.canvasID);
	this.engine = new BABYLON.Engine(this.canvas, this.options.antialias);

	Input.init(this.canvas);
	Input.getKey();

	BABYLON.Tools.RegisterTopRootEvents([
		{
			name: "resize",
			handler: function(){ self.engine.resize(); }
		}
	]);

	// init scene
	this.scene = new BABYLON.Scene(this.engine);
	this.scene.clearColor = new BABYLON.Color3(0,0,0);
	this.scene.ambientColor = new BABYLON.Color3(1,1,1);
	this.scene.collisionsEnabled = true;
	//this.scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.OimoJSPlugin());

	// skybox
	var skybox = BABYLON.Mesh.CreateBox("skybox", 10000.0, this.scene);
	var skyboxMat = new BABYLON.StandardMaterial("skyboxMat", this.scene);
	skyboxMat.backFaceCulling = false;
	skyboxMat.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", this.scene, ["_px.png", "_py.png", "_pz.png", "_nx.png", "_ny.png", "_nz.png"]);
	skyboxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMat.reflectionTexture.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
	skyboxMat.reflectionTexture.anisotropicFilteringLevel = 1;
	skyboxMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMat.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMat;
	skybox.infinteDistance = true;
	skybox.renderingGroupId = 0;

	this.camera = new BABYLON.TargetCamera("Camera", BABYLON.Vector3.Zero(), this.scene);
	this.camera.attachControl(this.canvas, false);

	this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(.1, 1, .1), this.scene);
	this.light.intensity = 0.8;
	this.light.diffuse = new BABYLON.Color3(1, 1, 1);
	this.light.specular = new BABYLON.Color3(0, 0, 0);
	this.light.groundColor = new BABYLON.Color3(0, 0, 0);

	this.cube = new BABYLON.Mesh.CreateBox("box", 3, this.scene);
	this.cube.showBoundingBox = true;
	this.cube.checkCollisions = true;
	var test = new BABYLON.Vector3(0, 4, 10);
	this.cube.moveWithCollisions(test);
	//this.cube.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 1});

	var redMat = new BABYLON.StandardMaterial("redMat", this.scene);
	redMat.ambientColor = new BABYLON.Color3(1, 0, 0);
	this.cube.material = redMat;

	this.ground = new BABYLON.Mesh.CreateBox("ground", 100, this.scene, false, BABYLON.Mesh.DOUBLESIDE);
	this.ground.rotation.x = BABYLON.Tools.ToRadians(-90);
	this.ground.position.y = -53;
	//this.ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {move: false});
	this.ground.showBoundingBox = true;
	this.ground.checkCollisions = true;

	this.player = new depth.Player();
	this.player.init(this, this.camera);
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
	var dt = this.engine.getDeltaTime()
	this.player.update(dt);

	Input.endFrame();
};

depth.DepthGame.prototype.render = function(){
	this.scene.render();
};
