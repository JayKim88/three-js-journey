import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

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
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2.5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

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

  // Update effect composer - resizing
  // Reduce the window to a minimal resolution, refresh and increase the resolution to the maximum size.
  // Everything should look bad, like a small image that we stretched up.
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.useLegacyLights = false;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post processing
 * EffectComposer - handle all the process of creating the render targets, doing the ping-pong thing,
 * sending the texture of the previous pass to the current pass, drawing the last one on the canvas, etc.
 */

// By default EffectComposer is using a WebGLRenderTarget without the antialias.(this makes stair-effect)
// in this case, provide customized render target set with samples property that will enable the antialias
// as the samples increase, performance gets lower
// Render target with antialias applied.
// Sadly, this won't work for every browsers. That is a matter of WebGL 2 support.
// https://caniuse.com/webgl2 . for example, webgl2 is not supported.
// thus, SMAAPass is used conditionally as the code found below.
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 0,
});

const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// In Three.js post-process "effects" are called "passes".
// This pass is in charge of the first render of our scene, but instead of doing it in the canvas,
// it will happen in a render target created inside the EffectComposer
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
glitchPass.goWild = false;
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.strength = 0.3;
unrealBloomPass.radius = 1;
unrealBloomPass.threshold = 0.6;
effectComposer.addPass(unrealBloomPass);

gui.add(unrealBloomPass, "enabled");
gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.001);
gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.001);
gui.add(unrealBloomPass, "threshold").min(0).max(1).step(0.001);

// Tint pass (customized pass)
const TintShader = {
  uniforms: {
    // We need to get the texture from the previous pass.
    // This texture is automatically stored in the "tDiffuse" uniform.
    // We must add the uniform with a null value
    tDiffuse: { value: null },
    uTint: { value: null },
  },
  vertexShader: `
      varying vec2 vUv;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        
        vUv = uv;
      }
    `,
  fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec3 uTint;

      varying vec2 vUv;

      void main(){
        // To get the pixels from a sampler2D (a texture), we need to use texture2D(...). 
        // It would require a texture as the first parameter and UV coordinates as the second parameter.
        vec4 color = texture2D(tDiffuse, vUv);
        color.rgb += uTint;
        gl_FragColor = color; 
      }
    `,
};

const tintPass = new ShaderPass(TintShader);
tintPass.material.uniforms.uTint.value = new THREE.Vector3();
effectComposer.addPass(tintPass);

gui
  .add(tintPass.material.uniforms.uTint.value, "x")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("red");
gui
  .add(tintPass.material.uniforms.uTint.value, "y")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("green");
gui
  .add(tintPass.material.uniforms.uTint.value, "z")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("blue");

// Displacement pass (customized pass) - makes waves along x axis
const DisplacementShader = {
  uniforms: {
    // We need to get the texture from the previous pass.
    // This texture is automatically stored in the "tDiffuse" uniform.
    // We must add the uniform with a null value
    tDiffuse: { value: null },
    uNormalMap: { value: null },
  },
  vertexShader: `
        varying vec2 vUv;
  
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          
          vUv = uv;
        }
      `,
  fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
  
        varying vec2 vUv;
  
        void main(){                
          // this is direction of pixel!
          vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0; // not using last arg
        //   vec2 newUv = vec2(
        //     vUv.x,
        //     vUv.y + sin(vUv.x * 10.0) * 0.1 // apply wave!
        //   );
          vec2 newUv = vUv + normalColor.xy * 0.2;
          vec4 color = texture2D(tDiffuse, newUv);

          vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
          // dot - Calculate the dot product of this vector and v.
          // clamp - without it, it can return negative value making the edge black like shadow
          float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
          color.rgb += lightness * 2.0;

          gl_FragColor = color; 
        }
      `,
};

const displacementPass = new ShaderPass(DisplacementShader);

displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
  "/textures/interfaceNormalMap.png"
);

effectComposer.addPass(displacementPass);

// when applying rgbShiftPass, it becomes darker.
// passes are rendered in render targets, and those don't support color space the same way.
// need to add one more pass named GammaCorrectionShader that will converter the colors space to SRGB.
// GammaCorrectionShader has fragmentShader having gl_FragColor = LinearTosRGB(tex);
// Caution! this pass must be the last pass. exception is antialias pass.
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

/*
We have different choices for the antialias pass:

FXAA: Performant, but the result is just "ok" and can be blurry
SMAA: Usually better than FXAA but less performant —not to be confused with MSAA
SSAA: Best quality but the worst performance
TAA: Performant but limited result
And many others.
*/

// the antialias pass should be added after gammaCorrectionPass in order to optimise it.
// For the better performance, apply below in case it's neccessary.

if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
  const smaaPass = new SMAAPass();
  effectComposer.addPass(smaaPass);
}

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  //   renderer.render(scene, camera);
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
