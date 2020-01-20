<template>
	<div class="home">
		<!-- <canvas></canvas> -->
	</div>
</template>

<script>
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
// import OrbitControls from 'three-orbitcontrols';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
	name: 'home',

	data() {
		return {
			camera: '',
			scene: '',
			renderer: '',
			controls: '',
			windowHalfX: '',
			windowHalfY: '',
			model: '',
			color: '#0000FF',
			pointLight: '',
		};
	},

	created() {
		// Get window size
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;

		// Init scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xefefef);

		// Init camera
		this.camera = new THREE.PerspectiveCamera(
			45,
			this.windowHalfX / this.windowHalfY,
			1,
			5000
		);

		// Position camera
		let coords = {
			x: 10,
			y: 500,
			z: 1000,
		};
		this.cameraPosition(coords);

		// Add ambient light
		let ambientLight = new THREE.AmbientLight(0x404040, 100);
		this.scene.add(ambientLight);

		// Init renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.windowHalfX, this.windowHalfY);
		document.querySelector('#app').appendChild(this.renderer.domElement);

		// Add controls
		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.addEventListener('change', this.render);
	},

	mounted() {
		let loader = new GLTFLoader();
	},

	methods: {
		render() {
			this.renderer.render(this.scene, this.camera);
		},

		cameraPosition(coords) {
			this.camera.position.x = coords.x || 0;
			this.camera.position.y = coords.y || 0;
			this.camera.position.z = coords.z || 0;
		},
	},
};
</script>

<style lang="scss">
canvas {
	width: 100%;
}

.c-color-picker {
	position: absolute;
	bottom: 24px;

	// width: 100%;
}
</style>
