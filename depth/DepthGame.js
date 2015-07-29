var depth = depth || {};

depth.DepthGame = function(options){
	options = options || {};
	options.canvasID = options.canvasID || "app-canvas";
	options.antialias = options.antialias || false;
	this.options = options;

	this.entityFactory = new depth.EntityFactory();
	this.canvas = null;
	this.app = null;
	this.camera = null;
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
	this.app.keyboard = new pc.Keyboard(window);
	this.app.mouse = new pc.Mouse(this.canvas);

	this.entityFactory.app = this.app;

	window.addEventListener('resize', function () {
		self.app.resizeCanvas(self.canvas.width, self.canvas.height);
	});

	this.app.scene.ambientLight = new pc.Color(.4,.4,.4);

	this.camera = new pc.Entity();
	this.camera.addComponent('camera', {
		clearColor: new pc.Color(0, 0, 0)
	});
	this.camera.setPosition(0, 15, 15);
	this.camera.setLocalEulerAngles(0, 0, 0);
	this.camera.setName('MainCamera');
	this.app.root.addChild(this.camera);

	this.player = this.entityFactory.createPlayer(new pc.Vec3(0, 5, 0));
	this.app.root.addChild(this.player);

	var floor = new pc.Entity();
	floor.setPosition(0, -.5, 0);
	floor.setLocalScale(200, 1, 200);
	floor.addComponent('model', {type: 'box'});
	floor.addComponent('collision', {
		type: 'box',
		halfExtents: new pc.Vec3(100, .5, 100)
	});
	floor.addComponent('rigidbody', {
		type: 'static',
		restitution: 0.5
	});
	floor.rigidbody.syncEntityToBody();
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
	this.app.on('preRender', function(dt){
		self.render();
	});
};

depth.DepthGame.prototype.update = function(dt){
};

depth.DepthGame.prototype.render = function(){
	this.renderGrid();
};

depth.DepthGame.prototype.renderGrid = function(){
	var cells = 100;
	var halfCell = cells * .5;

	var start = new pc.Vec3(-halfCell, 0, -halfCell);
	var end = new pc.Vec3(halfCell, 0, -halfCell);
	var color = new pc.Color(.5,.5,.5);

	for(var i = 0; i < cells; i++) {
		start.z += 1;
		end.z += 1;
		this.app.renderLine(start, end, color, pc.LINEBATCH_GIZMO);
	}

	start.set(-halfCell, 0, -halfCell);
	end.set(-halfCell, 0, halfCell);

	for(var i = 0; i < cells; i++) {
		start.x += 1;
		end.x += 1;
		this.app.renderLine(start, end, color, pc.LINEBATCH_GIZMO);
	}
};
