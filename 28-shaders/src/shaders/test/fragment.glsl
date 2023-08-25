precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

// One interesting thing with varyings is that the values between the vertices are interpolated. 
// If the GPU is drawing a fragment right between two vertices —one having a varying of 1.0 and 
// the other having a varying of 0.0—the fragment value will be 0.5.
// varying float vRandom; // From vertex.glsl

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(vRandom, vRandom * 0.2, 1.0, 1.0); 
    //    gl_FragColor = vec4(uColor, 1.0); // r, g, b, a. a -> transparency

    textureColor.rgb *= vElevation * 2.0 + 0.5; // close part is bright and dark in other case.
    gl_FragColor = textureColor;
}
