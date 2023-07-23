https://github.com/JayKim88/three-js-journey/assets/55373668/11a9be96-d71d-40d2-b3e5-0bcccdb32018

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32);
const count = 20000;

// |x,y,z|,|x,y,z|,|x,y,z|,|x,y,z|,|x,y,z| ... 500 sets.
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

// bind by 3
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particleMaterial = new THREE.PointsMaterial();
particleMaterial.size = 0.1;
particleMaterial.sizeAttenuation = true;
// particleMaterial.color = new THREE.Color("gold");
// in this case, particles are hidden behind by another particle.
// particleMaterial.map = particleTexture;

// How to fix - 1. the edge of particle is not still perfectly erased.
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;
// particleMaterial.alphaTest = 0.001;
// particleMaterial.depthTest = false; // this will write all of particles regardless of depth.
particleMaterial.depthWrite = false; // let WebGL not to write particles in the depth buffer with depthTest.
particleMaterial.blending = THREE.AdditiveBlending; // layered part illuminates.
particleMaterial.vertexColors = true; // let vertex colors applied

// Points
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

// Cube. particleMaterial.depthTest = false -> particles behind cube is visible.
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  //   particles.rotation.y = elapsedTime * 0.5;

  //  make the particles to move vertically like a wave - but this way is bad for performance.
  for (let i = 0; i < count; i++) {
    const i3 = i * 3; // first element of [x,y,z]

    const x = particlesGeometry.attributes.position.array[i3];

    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }

  particlesGeometry.attributes.position.needsUpdate = true; // able position to be updated

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

```
