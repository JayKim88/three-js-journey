// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency; // wave shape
uniform float uTime; // used for flag animation

// attribute vec3 position; 
// geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
// attribute float aRandom; 
// attribute vec2 uv;

// varying float vRandom; // This data is sent to fragment.glsl
varying vec2 vUv;
varying float vElevation;

void main()
{

    // The gl_Position(vec4) variable already exists. We need to assign it.   
    // This variable will contain the position of the vertex on the screen. 
    // Each matrix will transform the position until we get the final clip space coordinates.
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation; 

    // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    // modelPosition.z += aRandom * 0.1;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;


    gl_Position = projectedPosition; 
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    // vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}
