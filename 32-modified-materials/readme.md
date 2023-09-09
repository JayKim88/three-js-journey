![Screenshot 2023-09-09 at 3 17 58 PM](https://github.com/JayKim88/three-js-journey/assets/55373668/b3d89ee0-6bab-4932-89c4-3c0540266162)

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

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
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 1;
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
 * Material
 */

// Textures
const mapTexture = textureLoader.load("/models/LeePerrySmith/color.jpg");
mapTexture.colorSpace = THREE.SRGBColorSpace;
const normalTexture = textureLoader.load("/models/LeePerrySmith/normal.jpg");

// Material
const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
});

// Fixing the Shadow - The material used for the shadows is a MeshDepthMaterial
// Possible to override it.
const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

const customUniforms = {
  uTime: { value: 0 },
};

material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;

  // target glsl = node_modules/three/src/renderers/shaders/ShaderLib/meshphysical_vert.glsl.js
  /*
    #include <common>

    ...
    void main() {
        ...
        #endif

        #include <begin_vertex>
        ...
    }
    `;
  */
  /*
    Go to the /node_modules/three/src/renderers/shaders/ folder. That is where you'll find most of the Three.js shader codes.
    All the included parts are called chunks, and you can find them in the ShaderChunk/ folder.
    If we look at the different chunks, it seems that begin_vertex
    is handling the position first by creating a variable named transformed.
  */
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
        #include <common>
        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle) // https://thebookofshaders.com/08/
        {
            return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
        }
    `
  );
  /* 
  normals are coordinates associated with each vertices that tell what direction the faces are facing. 
  they would be arrows all over the model pointing on the outside. Those normals are used for things like lighting, reflecting and shadowing.
  The chunk handling the normals first is called beginnormal_vertex.  
  */
  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    `
        #include <beginnormal_vertex>

        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        
        objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  );
  /* begin_vertex.glsl.js
  export default ...`
    vec3 transformed = vec3( position );
  `
  */
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
      #include <begin_vertex>

      // it rotates the material by using the added get2dRotateMatrix function
      transformed.xz = rotateMatrix * transformed.xz;
    `
  );
};

// make shadow to rotate by using depthMaterial
depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
          #include <common>
          uniform float uTime;
  
          mat2 get2dRotateMatrix(float _angle) // https://thebookofshaders.com/08/
          {
              return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
          }
      `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
        #include <begin_vertex>
        
        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
  
        transformed.xz = rotateMatrix * transformed.xz;
      `
  );
};

/**
 * Models
 */
gltfLoader.load("/models/LeePerrySmith/LeePerrySmith.glb", (gltf) => {
  // Model
  const mesh = gltf.scene.children[0];
  mesh.rotation.y = Math.PI * 0.5;
  mesh.material = material; // Update the material
  mesh.customDepthMaterial = depthMaterial;
  scene.add(mesh);

  // Update materials
  updateAllMaterials();
});

/**
 * Plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15),
  new THREE.MeshStandardMaterial()
);
plane.rotation.y = Math.PI;
plane.position.y = -5;
plane.position.z = 5;
scene.add(plane);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  customUniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
```