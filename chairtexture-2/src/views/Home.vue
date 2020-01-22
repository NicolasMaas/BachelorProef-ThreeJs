<template>
	<div class="home">
		<!-- <canvas></canvas> -->

		<div class>
			<div
				class="o-row c-color-picker u-flex u-flex-direction-column u-justify-content-center u-align-items-center"
			>
				<p class="u-mb-sm">Lightcolor</p>
				<VueColorpicker
					v-model="color"
					@change="onChange"
				></VueColorpicker>
			</div>
		</div>
	</div>
</template>

<script>
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbitcontrols';
import { VueColorpicker } from 'vue-colorpicker-pop';
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default {
	name: 'home',

	components: {
		VueColorpicker,
	},

	data() {
		return {
			color: '#0000FF',
			pointLight: '',
		};
	},

	created() {
		let scene = new THREE.Scene();
		scene.background = new THREE.Color(0xefefef);
		let camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			1,
			5000
		);
		// camera.rotation.y = ((45 / 180) * Math.PI) / 2;
		// camera.rotation.y = 0;
		camera.position.x = 10;
		// camera.position.x = 500;
		camera.position.y = 500;
		camera.position.z = 1000;

		var pointLight = new THREE.PointLight(this.color, 2.5, 10000);
		// pointLight.position.set(220, 100, 0);
		pointLight.position.set(100, 100, 0);
		pointLight.castShadow = true;

		pointLight.shadow.mapSize.width = 1024; // default
		pointLight.shadow.mapSize.height = 1024; // default

		// pointLight.shadow.camera.near = 0; // default
		pointLight.shadow.camera.far = 2000; // default
		// pointLight.shadow.camera.fov = 1;

		pointLight.shadow.bias = -0.01;

		this.pointLight = pointLight;
		scene.add(pointLight);

		var sphereSize = 10;
		var pointLightHelper = new THREE.PointLightHelper(
			pointLight,
			sphereSize
		);
		scene.add(pointLightHelper);

		var pointLight2 = new THREE.PointLight(0xfff1c4, 0.2, 1000);
		pointLight2.position.set(100, 0, 0);
		pointLight2.castShadow = true;

		pointLight2.shadow.mapSize.width = 1024;
		pointLight2.shadow.mapSize.height = 1024;

		// pointLight2.shadow.camera.near = 0.5;
		pointLight2.shadow.camera.far = 2000;
		// pointLight2.shadow.camera.fov = 1;

		pointLight2.shadow.bias = -0.01;

		scene.add(pointLight2);

		var sphereSize = 10;
		var pointLightHelper = new THREE.PointLightHelper(
			pointLight2,
			sphereSize
		);
		scene.add(pointLightHelper);

		// var light2 = new THREE.PointLight(0xffffff, 2, 1000);
		// light2.position.set(200, 200, 200);
		// scene.add(light2);

		// var spotLight = new THREE.SpotLight(0xffffff);
		// spotLight.position.set(250, 300, 250);

		// spotLight.castShadow = true;

		// spotLight.shadow.mapSize.width = 1024;
		// spotLight.shadow.mapSize.height = 1024;

		// spotLight.shadow.camera.near = 500;
		// spotLight.shadow.camera.far = 4000;
		// spotLight.shadow.camera.fov = 30;

		// scene.add(spotLight);

		var ambientLight = new THREE.AmbientLight(0x404040, 100); // soft white light
		scene.add(ambientLight);

		// let directionalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
		// // directionalLight.position.set(100, 100, 100);
		// scene.add(directionalLight);

		// light = new THREE.PointLight(0xc4c4c4, 1);
		// light.position.set(0, 30, 10);
		// scene.add(light);

		// let spotlight = new THREE.SpotLight(0xffffff, 2);
		// spotlight.position.set(10, 100, 10);
		// scene.add(spotlight);

		var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);

		let controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', renderer);

		var loader = new GLTFLoader();

		loader.load(
			'./assets/models/chair_1/scene.gltf',
			function(gltf) {
				let room = gltf.scene.children[0];
				room.traverse(o => {
					if (o.isMesh) {
						o.castShadow = true;
						o.receiveShadow = true;
					}
				});
				room.scale.set(0.1, 0.1, 0.1);
				room.position.y = 0;
				room.position.x = 1000;
				scene.add(gltf.scene);
				animate();
			},
			undefined,
			function(error) {
				console.error(error);
			}
		);

		function animate() {
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		}
	},

	methods: {
		onChange(color) {
			this.color = this.rgbToColor(color);
			this.pointLight.color.setHex(this.rgbToHex(color));
		},

		componentFromStr(numStr, percent) {
			var num = Math.max(0, parseInt(numStr, 10));
			return percent
				? Math.floor((255 * Math.min(100, num)) / 100)
				: Math.min(255, num);
		},

		newTexture() {
			var newTexturePath =
				'textures/' + document.getElementById('texture').value + '';

			globalObject.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					//create a global var to reference later when changing textures
					child;
					//apply texture
					child.material.map = THREE.ImageUtils.loadTexture(
						newTexturePath
					);
					child.material.needsUpdate = true;
				}
			});
		},

		rgbToHex(rgb) {
			var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
			var result,
				r,
				g,
				b,
				hex = '';
			if ((result = rgbRegex.exec(rgb))) {
				r = this.componentFromStr(result[1], result[2]);
				g = this.componentFromStr(result[3], result[4]);
				b = this.componentFromStr(result[5], result[6]);

				hex =
					'0x' +
					(0x1000000 + (r << 16) + (g << 8) + b)
						.toString(16)
						.slice(1);

				return hex;
			}
		},

		rgbToColor(rgb) {
			var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
			var result,
				r,
				g,
				b,
				hex = '';
			if ((result = rgbRegex.exec(rgb))) {
				r = this.componentFromStr(result[1], result[2]);
				g = this.componentFromStr(result[3], result[4]);
				b = this.componentFromStr(result[5], result[6]);

				hex =
					'#' +
					(0x1000000 + (r << 16) + (g << 8) + b)
						.toString(16)
						.slice(1);

				return hex;
			}
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
