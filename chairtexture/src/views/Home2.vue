<template>
	<div class="home">
		<!-- <canvas></canvas> -->
	</div>
</template>

<script>
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import OrbitControls from "three-orbitcontrols";
import DragControls from "three-dragcontrols";
// import { DragControls } from "three/examples/jsm/controls/DragControls.js";

export default {
	name: "home",

	data() {
		return {
			camera: "",
			scene: "",
			renderer: "",
			controls: "",
			dragControls: "",
			windowHalfX: "",
			windowHalfY: "",
			model: "",
			texture: "",
			textureLegs: "",
			color: "#0000FF",
			pointLight: ""
		};
	},

	created() {
		// Get window size
		this.windowHalfX = window.innerWidth;
		this.windowHalfY = window.innerHeight;

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
			y: 200,
			z: 500
		};
		this.cameraPosition(coords);

		// Add ambient light
		let ambientLight = new THREE.AmbientLight(0x404040, 5);
		this.scene.add(ambientLight);

		// Init renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.windowHalfX, this.windowHalfY);
		document.querySelector("#app").appendChild(this.renderer.domElement);

		// Add controls
		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.addEventListener("change", this.render);

		this.dragControls = new DragControls(
			this.model,
			this.camera,
			this.renderer.domElement
		);

		this.dragControls.addEventListener("dragstart", function() {
			this.controls.enabled = false;
		});
		this.dragControls.addEventListener("dragend", function() {
			this.controls.enabled = true;
		});
	},

	//   async beforeMount() {
	//     await this.loadTexture();
	//     console.log(this.texture);
	//   },

	async mounted() {
		await this.loadTexture();

		let loader = new GLTFLoader();
		loader.load("./assets/models/chair_1/scene.gltf", gltf => {
			this.model = gltf.scene.children[0];

			this.model.traverse(o => {
				if (o.isMesh) {
					o.castShadow = true;
					o.receiveShadow = true;

					console.log(o.material);
					if (o.material.name == "101095") {
						o.material.map = this.texture;
					}

					if (o.material.name == "Material_3") {
						// o.material.map = this.textureLegs;
					}
					o.material.needsUpdate = true;
				}
			});

			this.model.scale.set(0.1, 0.1, 0.1);
			this.model.position.y = 0;
			this.model.position.x = 1050;

			this.scene.add(this.model);
			this.animate();
		});
	},

	methods: {
		render() {
			this.renderer.render(this.scene, this.camera);
		},

		animate() {
			this.renderer.render(this.scene, this.camera);
		},

		async loadTexture() {
			let loader = new THREE.TextureLoader();

			this.texture = loader.load(
				"./assets/models/chair_1/textures/101095_baseColor.jpeg"
			);

			this.textureLegs = loader.load(
				"./assets/models/chair_1/textures/Material_3_baseColor.jpeg"
			);
		},

		cameraPosition(coords) {
			this.camera.position.x = coords.x || 0;
			this.camera.position.y = coords.y || 0;
			this.camera.position.z = coords.z || 0;
		}
	}
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
