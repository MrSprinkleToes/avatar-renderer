import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { renderAvatar } from "./avatar";

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
new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

function render() {
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
requestAnimationFrame(render);

document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

renderAvatar(3, scene);
