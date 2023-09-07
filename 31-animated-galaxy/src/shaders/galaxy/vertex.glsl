uniform float uTime;
uniform float uSize;

attribute vec3 aRandomness;
attribute float aScale;

varying vec3 vColor;

void main() 
{
    /**
    *  Position
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Rotate - get angle by atan
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; // as further, it slows down.
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

     // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition; 

    /**
    *  Size
    */
    gl_PointSize = uSize * aScale;
    // size attenuation - /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    gl_PointSize *= ( 1.0 / - viewPosition.z );

    /**
    *  Color
    */
    vColor = color;
}
