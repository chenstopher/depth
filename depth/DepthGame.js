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
	this.scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.OimoJSPlugin());

	// skybox
	var skybox = BABYLON.Mesh.CreateBox("skybox", 10000.0, this.scene);
	var skyboxMat = new BABYLON.StandardMaterial("skybox", this.scene);
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
	this.light.specular = new BABYLON.Color3(1, 1, 1);
	this.light.groundColor = new BABYLON.Color3(0, 0, 0);

	this.cube = new BABYLON.Mesh.CreateBox("box", 1, this.scene);
	this.cube.position.z = 10;
	this.cube.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 1});

	this.ground = new BABYLON.Mesh.CreateBox("ground", 100, this.scene, false, BABYLON.Mesh.DOUBLESIDE);
	this.ground.rotation.x = BABYLON.Tools.ToRadians(-90);
	this.ground.position.y = -53;
	this.ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {move: false});
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
	var moveSpeed = .05;
	var sensitivity = .0005;

	var dir = BABYLON.Vector3.Zero();
	if(Input.getKey(KeyCode.SHIFT)){
		moveSpeed *= 3;
	}

	if(Input.getKey(KeyCode.COMMA)){
		dir.z += moveSpeed;
	}

	if(Input.getKey(KeyCode.O)){
		dir.z -= moveSpeed;
	}

	if(Input.getKey(KeyCode.A)){
		dir.x -= moveSpeed;
	}

	if(Input.getKey(KeyCode.E)){
		dir.x += moveSpeed;
	}

	if(Input.getKey(KeyCode.QUOTE)){
		dir.y -= moveSpeed;
	}

	if(Input.getKey(KeyCode.PERIOD)){
		dir.y += moveSpeed;
	}

	var cameraMatrix = BABYLON.Matrix.Zero();
	this.camera.getViewMatrix().invertToRef(cameraMatrix);
	this.camera.cameraDirection.copyFrom(BABYLON.Vector3.TransformNormal(dir, cameraMatrix));

	if(Input.isPointerLocked()) {
		this.camera.cameraRotation.x = Input.getMouseDelta().y * sensitivity;
		this.camera.cameraRotation.y = Input.getMouseDelta().x * sensitivity;
	}

	Input.endFrame();
};

depth.DepthGame.prototype.render = function(){
	this.scene.render();
};
