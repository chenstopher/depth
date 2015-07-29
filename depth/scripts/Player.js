var depth = depth || {};
depth.scripts = depth.scripts || {};

pc.script.create('player', function(app){
	depth.scripts.Player = function(entity) {
		this.entity = entity;
		this.force = new pc.Vec3(0, 0, 0);
		this.camera = null;
		this.pitch = 0;
		this.yaw = 0;
		this.sensitivity = 10;

	};

	depth.scripts.Player.prototype = {
		initialize : function (){
			// I'd like to inject this rather than look it up but I can't figure out how to. Because
			// a entity.script.player isn't available till initialize.
			this.camera = app.root.findByName('MainCamera');
			console.log('player init');

			app.mouse.disableContextMenu();
			app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
			app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

			this.entity.rigidbody.angularFactor.set(0, 0, 0);
		},

		update: function (dt) {
			var force = new pc.Vec3(0, 0, 0);
			if(app.keyboard.isPressed(pc.KEY_COMMA)){
				force.z -= 20;
			}
			if(app.keyboard.isPressed(pc.KEY_O)){
				force.z += 20;
			}
			if(app.keyboard.isPressed(pc.KEY_A)){
				force.x -= 20;
			}
			if(app.keyboard.isPressed(pc.KEY_E)){
				force.x += 20;
			}

			force = this.camera.getWorldTransform().transformVector(force);
			force.y = 0;

			this.entity.rigidbody.applyForce(force);

			if(app.keyboard.wasPressed(pc.KEY_SPACE)){
				this.entity.rigidbody.applyImpulse(new pc.Vec3(0, 5, 0));
			}

			if(this.camera != null){
				this.camera.setPosition(this.entity.getPosition());
				this.camera.translateLocal(0, 2, 0);
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
		}

	};

	return depth.scripts.Player;
});
