var depth = depth || {};
depth.scripts = depth.scripts || {};

pc.script.create('player', function(app){
	depth.scripts.Player = function(entity) {
		this.entity = entity;
		this.camera = null;
		this.pitch = 0;
		this.yaw = 0;
		this.sensitivity = 10;

		this.onGround = false;
		this.dir = new pc.Vec3(0, 0, 0);
		this.force = new pc.Vec3(0, 0, 0);
		this.jumpImpulse = new pc.Vec3(0, 5, 0);
		this.groundRayExtent = new pc.Vec3(0, 0, 0);
		this.camY = 0;
	};

	depth.scripts.Player.prototype = {
		initialize : function (){
			// I'd like to inject this rather than look it up but I can't figure out how to because
			// a entity.script.player isn't available till initialize().
			this.camera = app.root.findByName('MainCamera');
			console.log('player init');

			app.mouse.disableContextMenu();
			app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
			app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

			this.groundRayExtent.y = -((this.entity.collision.height/2) + .3);
			this.camY = this.entity.collision.height/2;
		},

		update: function (dt) {
			this._checkGround();

			this.dir.set(0, 0, 0);
			if(app.keyboard.isPressed(pc.KEY_COMMA)){
				this.dir.z -= 1;
			}
			if(app.keyboard.isPressed(pc.KEY_O)){
				this.dir.z += 1;
			}
			if(app.keyboard.isPressed(pc.KEY_A)){
				this.dir.x -= 1;
			}
			if(app.keyboard.isPressed(pc.KEY_E)){
				this.dir.x += 1;
			}

			this._move(this.dir);

			if(this.onGround && app.keyboard.wasPressed(pc.KEY_SPACE)){
				this._jump();
			}

			if(this.camera != null){
				// Could probably just parent the camera
				this.camera.setPosition(this.entity.getPosition());
				this.camera.translateLocal(0, this.camY, 0);
				this.camera.setEulerAngles(this.pitch, this.yaw, 0);
			}
		},

		onMouseMove: function(event) {
			this.pitch -= event.dy / this.sensitivity;
			this.pitch = pc.math.clamp(this.pitch, -90, 90);
			this.yaw -= event.dx / this.sensitivity;
		},

		onMouseDown: function(event){
			if(!pc.Mouse.isPointerLocked()){
				app.mouse.enablePointerLock();
			}
		},

		_checkGround: function(){
			var self = this;
			var start = this.entity.getPosition();
			var end = start.clone().add(this.groundRayExtent);

			self.onGround = false;

			// Turn off collider temporarily so I dont hit myself
			this.entity.collision.enabled = false;
			app.systems.rigidbody.raycastFirst(start, end, function(result){
				if(result.entity == self.entity){
					// This shouldn't happen though...
					console.log("hit myself");
				}

				self.onGround = true;
			});
			this.entity.collision.enabled = true;
		},

		_move: function(dir){
			this.force = this.camera.getWorldTransform().transformVector(dir);
			this.force.y = 0;
			this.force.scale(this.onGround ? 100 : 0);

			this.entity.rigidbody.applyForce(this.force);

			if(this.onGround){
				var vel = this.entity.rigidbody.linearVelocity;
				var velY = vel.y;
				vel.y = 0;

				var speed = vel.length();
				var maxSpeed = 15;

				// Clamp max speed
				// TODO maybe better use forces rather than setting linvel?
				if(speed > maxSpeed){
					vel.normalize().scale(maxSpeed);
					vel.y = velY;
					this.entity.rigidbody.linearVelocity = vel;
				}

				// Apply a stopping force when not trying to move
				if(this.force.lengthSq() == 0){
					vel = this.entity.rigidbody.linearVelocity;
					vel.y = 0;
					vel.scale(-10);
					this.entity.rigidbody.applyForce(vel);
				}
			}

			// TODO air strafing
		},

		_jump: function(){
			this.entity.rigidbody.applyImpulse(this.jumpImpulse);
			this.onGround = false;
		}
	};

	return depth.scripts.Player;
});
