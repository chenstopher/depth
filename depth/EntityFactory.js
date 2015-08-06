var depth = depth || {};

depth.EntityFactory = function(app) {
	this.app = null;
};

depth.EntityFactory.prototype.createPlayer = function(position){
	var player = new pc.Entity();
	player.addComponent('script', { scripts: [{name: 'player', url: 'depth/scripts/Player.js'}] });

	//player.addComponent('model', {
	//	type: 'capsule',
	//	castShadows: true
	//});

	player.addComponent('collision', {
		type: 'capsule',
		radius: .5,
		height: 2
	});

	player.addComponent('rigidbody', {
		type: 'dynamic',
		restitution: 0,
		angularFactor: new pc.Vec3(0, 0, 0),
		friction: 0
	});
	player.setPosition(position);

	player.rigidbody.syncEntityToBody();

	return player;
};

depth.EntityFactory.prototype.createCrate = function(position, size){
	if(size === undefined){
		size = 1;
	}

	var entity = new pc.Entity();
	entity.setLocalScale(size, size, size);
	entity.setPosition(position);

	entity.addComponent('model', {
		type: 'box',
		castShadows: true
	});

	entity.addComponent('collision', {
		type: 'box',
		halfExtents: new pc.Vec3(size, size, size).scale(.5)
	});

	entity.addComponent('rigidbody', {
		type: 'static',
		friction: .9,
		mass: size
	});

	entity.rigidbody.syncEntityToBody();

	return entity;
};
