import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();
// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const scene = new THREE.Scene();

camera.position.z = 5;

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
scene.add(cube);

function render() {
	renderer.render(scene, camera);
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	cube.rotation.z += 0.01;
	requestAnimationFrame(render);
}
requestAnimationFrame(render);

document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);
