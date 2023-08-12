import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GroundProjectedSkybox } from "three/addons/objects/GroundProjectedSkybox.js";

/**
 * Loaders
 */

const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const global = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Update all materials
const updateAllMaterials = () => {
  /**
   * @description traverse - Executes the callback on this object and all descendants.
   *  Note: Modifying the scene graph inside the callback is discouraged.
   */
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      // envMapIntensity - Scales the effect of the environment map by multiplying its color.
      child.material.envMapIntensity = global.envMapIntensity;

      // gui.add(child.material, "envMapIntensity").min(0).max(10).step(0.001); -> instead, use global map intensity
    }
  });
};

/**
 * Environment map
 */
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);

// Global intensity
global.envMapIntensity = 1;
gui
  .add(global, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

// 1. LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//   "/environmentMaps/0/px.png",
//   "/environmentMaps/0/nx.png",
//   "/environmentMaps/0/py.png",
//   "/environmentMaps/0/ny.png",
//   "/environmentMaps/0/pz.png",
//   "/environmentMaps/0/nz.png",
// ]);

// scene.environment = environmentMap;
// scene.background = environmentMap;

// 2. HDR(High Dynamic Range) (RGBE) enquirectangular
// rgbeLoader.load("/environmentMaps/blender-2k-1.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = environmentMap;
//   // scene.background = environmentMap;
// });

// 3. LRD enquirectangular
// const environmentMap = textureLoader.load("/environmentMaps/animal-city.jpg");
// environmentMap.mapping = THREE.EquirectangularReflectionMapping; // for equirectangular texture
// environmentMap.colorSpace = THREE.SRGBColorSpace;

// scene.environment = environmentMap;
// scene.background = environmentMap;

// 4. Ground projected skybox - put the object on the ground!
// rgbeLoader.load("/environmentMaps/2/2k.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = environmentMap; // just for light to the object!

//   //Skybox - the below could be not perfect for other environmentMaps
//   const skybox = new GroundProjectedSkybox(environmentMap);
//   skybox.radius = 120;
//   skybox.height = 11;
//   skybox.scale.setScalar(50);
//   scene.add(skybox);

//   gui.add(skybox, "radius", 1, 200, 0.1).name("skyboxRadius");
//   gui.add(skybox, "height", 1, 200, 0.1).name("skyboxHeight");
// });

/**
 * Real time environment map
 */
const environmentMap = textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg"
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace; // sRGB is a standard RGB (red, green, blue) color space

scene.background = environmentMap;

// Holy donut
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
);

// We want our holyDonut to be visible for both the default camera and the cubeCamera.
// And since the default layer is 0, we just need to add 1:
holyDonut.layers.enable(1);

holyDonut.position.y = 3.5;
scene.add(holyDonut);

// Cube render target
// The main idea is to render the scene inside our own environment map texture by a cube texture.
// Use a WebGLCubeRenderTarget. Render targets are textures where we can store renders of any scene.
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  256, // the resolution of each side of the cube
  {
    // behavior as an HDR with a high range of data, THREE.HalfFloatType or THREE.FloatType.
    // HalfFloatType uses only 16 bits, but it’s still quite a wide range. Better for performance.
    type: THREE.HalfFloatType,
  }
);

scene.environment = cubeRenderTarget.texture;

// Cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);
// cubeCamera.layers.enable(0); // this make the camera see 0 layer objects

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    // a small torus knot is reflected on the identical torus knot. To fix, use layer.
    // By setting layers on a camera, this camera will only see objects matching the same layers.
    roughness: 0,
    metalness: 1,
    color: 0xaaaaaa,
  })
);
torusKnot.position.y = 4;
torusKnot.position.x = -4;
scene.add(torusKnot);

/**
 * Models
 */
gltfLoader.load("models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  /**
   * MeshStandardMaterial needs lights
   */
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);
  updateAllMaterials();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Real time environment map
  if (holyDonut) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

    cubeCamera.update(renderer, scene);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
