import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
	//Text

	const textGeometry = new THREE.TextGeometry("Love Donuts.", {
		font: font,
		size: 0.5,
		height: 0.2,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 5,
	});

	const textRonaldGeometry = new THREE.TextGeometry(
		"Made by Ronald Pereira.",
		{
			font: font,
			size: 0.1,
			height: 0.2,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.01,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5,
		}
	);

	textGeometry.center();
	textRonaldGeometry.translate(0.5, -0.5, 0);

	const material = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	});
	const text = new THREE.Mesh(textGeometry, material);
	const textRonald = new THREE.Mesh(textRonaldGeometry, material);

	scene.add(text, textRonald);

	//Donuts

	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

	for (let i = 0; i < 100; i++) {
		const donut = new THREE.Mesh(donutGeometry, material);
		donut.position.x = (Math.random() - 0.5) * 10;
		donut.position.y = (Math.random() - 0.5) * 10;
		donut.position.z = (Math.random() - 0.5) * 10;
		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);
		scene.add(donut);
	}
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects

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

camera.position.z = 8;
camera.lookAt(scene.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});

renderer?.setSize(sizes.width, sizes.height);

//Animate

const Tick = () => {
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
