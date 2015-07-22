var depth = depth || {};

depth.Player = function(){
	this.moveSpeed = 5.0/1000;
	this.sensitivity = .0005;

	this.camera = null;
	this.cameraOffset = BABYLON.Vector3.Zero();
	this.collisionSphere = null;
};

depth.Player.prototype.init = function(game, camera){
	this.camera = camera;
	this.camera.checkCollisions = false;

	this.collisionSphere = new BABYLON.Mesh.CreateSphere("playerCollisionSphere", 16, 2, game.scene);
	this.collisionSphere.ellipsoid = new BABYLON.Vector3(1, 1, 1);
	// Why the fuck do I need a 1 offset on the y axis for this to work?
	this.collisionSphere.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
	this.collisionSphere.checkCollisions = true;
	this.collisionSphere.showBoundingBox = true;
};

depth.Player.prototype.update = function(dt){
	var vel = BABYLON.Vector3.Zero();

	if(Input.getKey(KeyCode.COMMA)){
		vel.z += 1;
	}

	if(Input.getKey(KeyCode.O)){
		vel.z -= 1;
	}

	if(Input.getKey(KeyCode.A)){
		vel.x -= 1;
	}

	if(Input.getKey(KeyCode.E)){
		vel.x += 1;
	}

	// Convert to camera coordinates
	var cameraMatrix = BABYLON.Matrix.Zero();
	this.camera.getViewMatrix().invertToRef(cameraMatrix);
	vel.copyFrom(BABYLON.Vector3.TransformNormal(vel, cameraMatrix));

	// Project onto y plane
	vel.y = 0;

	if(Input.getKey(KeyCode.QUOTE)){
		vel.y -= 1;
	}

	if(Input.getKey(KeyCode.PERIOD)){
		vel.y += 1;
	}

	vel.y += -9.8;

	vel.scaleInPlace(this.moveSpeed * (Input.getKey(KeyCode.SHIFT) ? 3 : 1));
	vel.scaleInPlace(dt);

	this.collisionSphere.moveWithCollisions(vel);

	if(Input.isPointerLocked()) {
		this.camera.cameraRotation.x = Input.getMouseDelta().y * this.sensitivity;
		this.camera.cameraRotation.y = Input.getMouseDelta().x * this.sensitivity;
	}

	this.camera.position.copyFrom(this.collisionSphere.position);
	this.camera.position.addInPlace(this.cameraOffset);
};
