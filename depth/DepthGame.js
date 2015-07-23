var depth = depth || {};

depth.DepthGame = function(options){
	options = options || {};
	options.canvasID = options.canvasID || "app-canvas";
	options.antialias = options.antialias || false;
	this.options = options;

	this.canvas = null;
	this.app = null;
	this.camera = null;
	this.cube = null;
	this.player = null;
};

depth.DepthGame.prototype.init = function(){
	console.log("init");
	var self = this;

	this.canvas = document.getElementById(this.options.canvasID);
	this.app = new pc.Application(this.canvas, {});

	this.app.start();

	this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
	this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

	window.addEventListener('resize', function () {
		self.app.resizeCanvas(self.canvas.width, self.canvas.height);
	});

	this.app.scene.ambientLight = new pc.Color(.4,.4,.4);

	this.camera = new pc.Entity();
	this.camera.addComponent('camera', {
		clearColor: new pc.Color(0, 0, 0)
	});
	this.camera.setPosition(0, 15, 15);
	this.camera.setLocalEulerAngles(-45, 0, 0);
	this.app.root.addChild(this.camera);

	this.cube = new pc.Entity();
	this.cube.addComponent('model', {
		type: "box",
		castShadows: true
	});
	this.cube.addComponent('collision', {
		type: "box",
		halfExtents: new pc.Vec3(.5,.5, .5)
	});
	this.cube.addComponent('rigidbody', { type: 'dynamic' });
	this.cube.setPosition(0, 3, 0);
	this.cube.rigidbody.syncEntityToBody();
	this.app.root.addChild(this.cube);

	var floor = new pc.Entity();
	floor.setLocalScale(10, 1, 10);
	floor.addComponent('model', {type: 'box'});
	floor.addComponent('collision', {
		type: 'box',
		halfExtents: new pc.Vec3(.5,.5,.5)
	});
	floor.addComponent('rigidbody', {
		type: 'static',
		restitution: 0.5
	});
	this.app.root.addChild(floor);

	var light = new pc.Entity();
	light.addComponent('light', {
		castShadows: true
	});
	light.setEulerAngles(0, 0, 0);
	this.app.root.addChild(light);

	this.app.systems.rigidbody.setGravity(0, -9.8, 0);

	this.app.on('update', function(dt){
		self.update(dt);
	});
};

depth.DepthGame.prototype.update = function(dt){
};

depth.DepthGame.prototype.render = function(){
};
