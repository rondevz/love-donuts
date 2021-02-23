import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const parameters = {
	color: 0x14932b,
	spin: () => {
		gsap.to(mesh.rotation, {
			duration: 1,
			y: mesh.rotation.y + Math.PI * 2,
		});
	},
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

// Objects

const material = new THREE.MeshStandardMaterial()

material.map = doorColorTexture
material.displacementMap = doorHeightTexture
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.alphaMap = doorAlphaTexture

material.side = THREE.DoubleSide;
material.displacementScale = 0.05
material.normalScale.set(0.5, 0.5)
material.transparent = true

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 64, 128),
	material
);

sphere.position.x = -1.5;
torus.position.x = 1.5;

sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1

scene.add(sphere, plane, torus);

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000
);

camera.position.z = 3;
camera.lookAt(scene.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});

renderer?.setSize(sizes.width, sizes.height);

//Animate

const clock = new THREE.Clock();

const Tick = () => {
    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

	renderer.render(scene, camera);
	controls.update();
	window.requestAnimationFrame(Tick);
};

Tick();

// Events

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	const fullscreenElement =
		document.fullscreenElement || document.webkitFullscreenElement;

	if (!fullscreenElement) {
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		} else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
});

/**
 * Debug
 */
const gui = new dat.GUI({ closed: true });
gui.hide();

const materialGui = gui.addFolder('Material');

materialGui.add(material, 'metalness').min(0).max(1).step(0.0001)
materialGui.add(material, 'roughness').min(0).max(1).step(0.0001)
