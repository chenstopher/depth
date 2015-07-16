var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function() {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0,0,0);

	var camera = new BABYLON.ArcRotateCamera("Camera", 1.0, 1.0, 12, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, false);

	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = .5;

	var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);

	return scene;
};

var scene = createScene();

engine.runRenderLoop(function(){
	scene.render();
});

window.addEventListener("resize", function(){
	engine.resize();
});
