<template>
	<div class="home">
		<!-- <canvas></canvas> -->
	</div>
</template>

<script>
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default {
	name: 'home',

	created() {
		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

		var loader = new THREE.GLTFLoader();

		loader.load(
			'./assets/models/isometric_bedroom_lowpoly/scene.gltf',
			function(gltf) {
				scene.add(gltf.scene);
			},
			undefined,
			function(error) {
				console.error(error);
			}
		);

		camera.position.z = 5;

		function animate() {
			requestAnimationFrame(animate);

			renderer.render(scene, camera);
		}

		animate();
	},

	methods: {},
};
</script>

<style lang="scss">
canvas {
	// width: 100%;
}
</style>
