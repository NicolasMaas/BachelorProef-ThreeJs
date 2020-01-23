// Variables
const BACKGROUND_COLOR = 0xf1f1f1;
const MODEL_PATH = "./chesterfield/scene.gltf";
const INITIAL_MTL = new THREE.MeshPhongMaterial({
    color: 0xf1f1f1,
    shininess: 10
});

const INITIAL_MAP = [{
        childID: "101095",
        mtl: INITIAL_MTL
    },
    {
        childID: "Material_3",
        mtl: INITIAL_MTL
    }
];

let cameraDistance = 7;
let model, sack;
let activeColor = 'blue';
let objects = [];

const button = document.querySelector("#changeTexture");

// Init Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

// Get the canvas
const canvas = document.querySelector('#canvas');

// Init the renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Add a camera
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = cameraDistance;

// Init the object loader
let loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, gltf => {
    model = gltf.scene;

    model.traverse(o => {
        if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;

            objects.push(o);
        }
    });

    // Init model scale
    model.scale.set(1, 1, 1);
    model.rotation.y = Math.PI;
    model.position.y = 0;
    model.position.x = 0;
    model.position.z = 0;

    changeTexture();

    scene.add(model);
});

loader.load("./sack_v2/scene.gltf", gltf => {
    sack = gltf.scene;

    sack.traverse(o => {
        if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;

            objects.push(o);
        }
    });

    // Init model scale
    sack.scale.set(0.01, 0.01, 0.01);
    sack.rotation.y = Math.PI;
    sack.position.y = -1;
    sack.position.x = 2;
    sack.position.z = 0;

    scene.add(sack);
});

// Add lights
// let ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight)

let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// Add directional Light to scene    
scene.add(dirLight);

// let dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
// dirLight2.position.set(8, 12, 8);
// dirLight2.castShadow = true;
// dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
// // Add directional Light to scene    
// scene.add(dirLight2);

// Floor
let floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
let floorMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    shininess: 30
});


let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);

// Add controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 0.2; // 30

const dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
dragControls.addEventListener('dragstart', event => {
    controls.enabled = false;
});
dragControls.addEventListener('drag', event => {
    event.object.position.z = 0;
})
dragControls.addEventListener('dragend', event => {
    controls.enabled = true;
});

function animate() {

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
}

animate();

// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {

        renderer.setSize(width, height, false);
    }
    return needResize;
}

function changeTexture() {
    let textureLoader = new THREE.TextureLoader();

    if (activeColor == 'red') {
        let textureBody = textureLoader.load('./chesterfield/textures/Body_baseColor_blue.jpeg')
        textureBody.flipY = false;
        let textureCushion = textureLoader.load('./chesterfield/textures/Cushion_baseColor_blue.jpeg');
        textureCushion.flipY = false;
        activeColor = 'blue';
        textureApply(textureBody, textureCushion)
    } else {
        let textureBody = textureLoader.load('./chesterfield/textures/Body_baseColor.jpeg')
        textureBody.flipY = false;
        let textureCushion = textureLoader.load('./chesterfield/textures/Cushion_baseColor.jpeg');
        textureCushion.flipY = false;
        activeColor = 'red';
        textureApply(textureBody, textureCushion)
    }
}

function textureApply(textureBody, textureCushion) {
    let textureLoader = new THREE.TextureLoader();

    let aoMapBody = textureLoader.load('./chesterfield/textures/Body_metallicRoughness.png')
    aoMapBody.flipY = false;

    let normalMapBody = textureLoader.load('./chesterfield/textures/Body_normal.png');
    normalMapBody.flipY = false;

    let aoMapCushion = textureLoader.load('./chesterfield/textures/Cushion_metallicRoughness.png')
    aoMapCushion.flipY = false;

    let normalMapCushion = textureLoader.load('./chesterfield/textures/Cushion_normal.png');
    normalMapCushion.flipY = false;

    model.traverse(o => {
        if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;

            if (o.name == "Body") {
                o.material = new THREE.MeshBasicMaterial({
                    map: textureBody,
                    aoMap: aoMapBody,
                    normalMap: normalMapBody
                })
            }

            if (o.name == "Cushion") {
                o.material = new THREE.MeshBasicMaterial({
                    map: textureCushion,
                    aoMap: aoMapCushion,
                    normalMap: normalMapCushion
                })
            }
            objects.push(o);
        }
    });
}