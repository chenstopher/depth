var depth = depth || {};

depth.EntityFactory = function(app) {
	this.app = null;
};

depth.EntityFactory.prototype.createPlayer = function(position){
	var player = new pc.Entity();
	player.addComponent('script', { scripts: [{name: 'player', url: 'depth/scripts/Player.js'}] });

	player.addComponent('model', {
		type: "box",
		castShadows: true
	});

	player.addComponent('collision', {
		type: "box",
		halfExtents: new pc.Vec3(.5,.5,.5)
	});

	player.addComponent('rigidbody', { type: 'dynamic' });
	player.setPosition(position);

	player.rigidbody.syncEntityToBody();

	return player;
};
