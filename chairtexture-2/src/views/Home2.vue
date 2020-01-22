<template>
  <div class="home">
    <div class="c-colors">
      <div class="c-color c-color--blue" @click="changeColorSeat('blue')"></div>
      <div class="c-color c-color--red" @click="changeColorSeat('red')"></div>
      <div class="c-color c-color--green" @click="changeColorSeat('green')"></div>
      <div class="c-color c-color--black" @click="changeColorSeat('black')"></div>
      <div class="c-color c-color--grey" @click="changeColorSeat('grey')"></div>
    </div>
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
      objects: [],
      model: "",
      colors: [],
      activeColor: "grey",
      scene: "",
      canvas: "",
      camera: "",
      cameraDistance: 300,
      renderer: "",

      backgroundColor: "0xf1f1f1",
      activeOption: "cushion",
      isLoaded: false
    };
  },

  created() {
    // Init the scene & set background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f1f1);
    this.scene.fog = new THREE.Fog(0xf1f1f1, 500, 2000);

    // Add ambient light
    let ambientLight = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(ambientLight);

    // Other lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 80);
    this.scene.add(hemiLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-650, 12, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    this.scene.add(dirLight);

    let dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight2.position.set(650, 12, 80);
    dirLight2.castShadow = true;
    dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
    this.scene.add(dirLight2);

    // Add floor
    var floorGeometry = new THREE.PlaneGeometry(800, 800, 1, 1);
    var floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 30
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -1;
    floor.position.x = 0;
    this.scene.add(floor);

    // Init the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    document.querySelector("#app").appendChild(this.renderer.domElement);

    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    // Add a camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    this.camera.position.z = this.cameraDistance;
    this.camera.position.x = 100;
    this.camera.position.y = 180;
    this.camera.rotation.x = Math.PI;

    // var helper = new THREE.CameraHelper(this.camera);
    // this.scene.add(helper);
  },

  mounted() {
    this.loadTexture();

    let loader = new GLTFLoader();
    loader.load("./assets/models/chair_1/scene.gltf", gltf => {
      this.model = gltf.scene;

      this.model.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;

          console.log(o.material.map);

          if (o.material.name == "101095") {
            o.material.map.image.src = this.texture;
            o.material.map.needsUpdate = true;
          }

          if (o.material.name == "Material_3") {
            o.material.map.image.src = this.textureLegs;
            o.material.map.needsUpdate = true;
          }
        }
      });

      this.model.scale.set(0.1, 0.1, 0.1);
      this.model.position.y = 0;
      this.model.position.x = 1050;

      this.objects = this.model;

      this.scene.add(this.model);
      this.animate();
    });

    // Add controls
    let controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 3;
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = 0.2; // 30
    controls.addEventListener("change", this.render);

    let dragControls = new DragControls(
      this.objects,
      this.camera,
      this.renderer.domElement
    );

    dragControls.addEventListener("dragstart", function() {
      controls.enabled = false;
    });
    dragControls.addEventListener("dragend", function() {
      controls.enabled = true;
    });

    console.log(this.objects);
  },

  methods: {
    render() {
      this.renderer.render(this.scene, this.camera);
    },

    animate() {
      this.renderer.render(this.scene, this.camera);
    },

    loadTexture() {
      this.texture =
        "./assets/models/chair_1/textures/101095_baseColor_green.jpg";

      this.textureLegs =
        "./assets/models/chair_1/textures/Material_3_baseColor.jpeg";
    },

    changeColorSeat(color) {
      switch (color) {
        case "grey":
          this.texture =
            "./assets/models/chair_1/textures/101095_baseColor.jpeg";
          this.changeTextureSeat();
          break;

        case "blue":
          this.texture =
            "./assets/models/chair_1/textures/101095_baseColor_blue.jpg";
          this.changeTextureSeat();
          break;

        case "green":
          this.texture =
            "./assets/models/chair_1/textures/101095_baseColor_green.jpg";
          this.changeTextureSeat();
          break;

        case "black":
          console.log("Going black");
          this.texture =
            "./assets/models/chair_1/textures/101095_baseColor_black.jpg";
          this.changeTextureSeat();
          break;

        default:
          this.texture =
            "./assets/models/chair_1/textures/101095_baseColor.jpeg";
          this.changeTextureSeat();
          break;
      }
    },

    changeTextureSeat() {
      this.model.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;

          console.log(o.material.map);

          if (o.material.name == "101095") {
            o.material.map.image.src = this.texture;
            o.material.map.needsUpdate = true;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
canvas {
  //   width: 100%;
}

.c-colors {
  position: fixed;
  bottom: 32px;
  left: 0;
  right: 0;

  width: 90%;

  background: #fff;
  margin: 0 auto;
  padding: 16px 24px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-radius: 6px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);

  box-sizing: border-box;
}

.c-color {
  width: 32px;
  height: 32px;
  content: " ";
  border-radius: 6px;
  cursor: pointer;
}

.c-color--blue {
  background: rgb(29, 108, 255);
}

.c-color--red {
  background: rgb(255, 74, 29);
}

.c-color--green {
  background: rgb(7, 199, 55);
}

.c-color--black {
  background: rgb(49, 49, 49);
}

.c-color--grey {
  background: grey;
}
</style>
