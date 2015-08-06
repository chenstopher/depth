var depth = depth || {};
depth.scripts = depth.scripts || {};

pc.script.create('player', function(app){
	depth.scripts.Player = function(entity) {
		this.entity = entity;
		this.camera = null;
		this.pitch = 0;
		this.yaw = 0;
		this.sensitivity = 10;

		this.moveForce = 200;
		this.jumpImpulse = new pc.Vec3(0, 5, 0);
		this.airStrafeStrength = 1;
		this.maxSpeed = 12;

		this.onGround = false;
		this.launchRotation = pc.Quat.IDENTITY;
		this.dir = new pc.Vec3(0, 0, 0);
		this.force = new pc.Vec3(0, 0, 0);
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

			this._limitSpeed();
			this._move(this.dir, dt);

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
			if(pc.Mouse.isPointerLocked()){
				this.pitch -= event.dy / this.sensitivity;
				this.pitch = pc.math.clamp(this.pitch, -90, 90);
				this.yaw -= event.dx / this.sensitivity;
			}
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

			var wasOnGround = self.onGround;;
			self.onGround = false;

			var dir = end.clone().sub(start);
			dir.normalize();

			var rayCallback = function(result){
				if(result.entity == self.entity){
					start = result.point;
					start.add(dir.clone().scale(.01));
					app.systems.rigidbody.raycastFirst(start, end, rayCallback);
				} else {
					self.onGround = true;
					if(!wasOnGround){
						// Find the quaternion, q, that would result in:
						//  q * camera.forward = rigidbody.linearVelocity
						// This is the "reference quaternion" that would tells me which direction
						// the player was moving in relation to where he was looking when he last
						// jumped or fell. I can then use this quaternion to morph the linearVelocity
						// while in the air so that the player will always be moving in that same
						// relative direction when moving in the air.
						var forward = self.camera.forward;
						forward.y = 0;
						forward.normalize();
						var vel = self.entity.rigidbody.linearVelocity;
						vel.y = 0;
						vel.normalize();

						var cross = new pc.Vec3().cross(forward, vel);

						self.launchRotation.x = cross.x;
						self.launchRotation.y = cross.y;
						self.launchRotation.z = cross.z;
						self.launchRotation.w = 1 + forward.dot(vel);
						self.launchRotation.normalize();
					}
				}
			};

			app.systems.rigidbody.raycastFirst(start, end, rayCallback);

			if(wasOnGround != self.onGround){
				console.log("onground "+self.onGround);
			}
		},

		_move: function(dir, dt){

			if(this.onGround){
				if(dir.x != 0 || dir.z != 0) {
					dir.normalize();

					this.force = this.camera.getWorldTransform().transformVector(dir);
					this.force.y = 0;
					this.force.scale(this.moveForce);

					this.entity.rigidbody.applyForce(this.force);
				}
			} else {
				// Shape the linear velocity so that the player is always air strafing in the relative
				// direction that he was looking at when he left the ground.

				var vel = this.entity.rigidbody.linearVelocity;
				var velY = vel.y;
				vel.y = 0;
				var speed = vel.length();

				var desiredVel = this.launchRotation.transformVector(this.camera.forward);
				desiredVel.y = 0;
				desiredVel.normalize();
				desiredVel.scale(speed);

				// Maybe do a rotation speed limit instead of lerp
				desiredVel.lerp(vel, desiredVel, this.airStrafeStrength * dt);

				desiredVel.y = velY;

				this.entity.rigidbody.linearVelocity = desiredVel;
			}

			// TODO air strafing
		},

		_limitSpeed: function(){
			if(this.onGround){
				var vel = this.entity.rigidbody.linearVelocity;
				var velY = vel.y;
				vel.y = 0;

				var speed = vel.length();

				// Clamp max speed
				// TODO maybe better use forces rather than setting linvel?
				if(speed > this.maxSpeed){
					vel.normalize().scale(this.maxSpeed);
					vel.y = velY;
					this.entity.rigidbody.linearVelocity = vel;
				}

				// Apply a stopping force when not trying to move
				if(this.dir.x == 0 && this.dir.z == 0){
					vel = this.entity.rigidbody.linearVelocity;
					vel.y = 0;
					vel.scale(-10);
					this.entity.rigidbody.applyForce(vel);
				}
			}
		},

		_jump: function(){
			this.entity.rigidbody.applyImpulse(this.jumpImpulse);
			this.onGround = false;
		}
	};

	return depth.scripts.Player;
});
