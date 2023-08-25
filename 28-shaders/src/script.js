import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// 1. npm i vite-plugin-glsl
// 2. vite.config.js settings -> plugins: [glsl()],
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

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

const flagTexture = textureLoader.load("textures/flag-french.jpg");

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
/*
geometry : {
  attributes {
    normal: {},
    position: {},
    uv: {}
  },
  ...
}
*/

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

// This can be used in vertex.glsl as modelPosition.z += aRandom * 0.1;
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1)); // 1 random value per vertex

/*
Until now, we have used RawShaderMaterial. 
The ShaderMaterial works just the same, but with pre-built uniforms and attributes prepended in the shader codes. 
The precision will also be automatically set.

Then, remove the following uniform and attribute and precision in both shaders:
- uniform mat4 projectionMatrix;
- uniform mat4 viewMatrix;
- uniform mat4 modelMatrix;
- attribute vec3 position;
- attribute vec2 uv;
- precision mediump float;
*/
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  // transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) }, // This can be used in vertex.glsl
    uTime: { value: 0 }, // This is used for flag animation
    uColor: {
      value: new THREE.Color("orange"),
    },
    uTexture: {
      // To take fragment colors from a texture and apply them in the fragment shader,
      // We must use the texture2D(...) function.
      // The second parameter consists of the coordinates of where to pick the color on that texture,
      // We are looking for coordinates to project a texture on a geometry. We are talking about UV coordinates.
      // -> geometry.attributes.uv
      value: flagTexture,
    },
  },
});

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyX");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyY");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
