The language used to code the shaders is called GLSL and stands for OpenGL Shading Language.

![Screenshot 2023-08-25 at 5 35 35 AM](https://github.com/JayKim88/three-js-journey/assets/55373668/eb299aa8-4828-4407-96d3-f97aafcfdf3e)

## vertex.glsl

```glsl
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

```

## fragment.glsl

```glsl
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
```

GLSL References

- [Shaderific documentation](https://shaderific.com/glsl.html)
- [Kronos Group OpenGL reference pages](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php)
- [Book of shaders documentation](https://thebookofshaders.com/)

If you want to find out more about those matrices and coordinates, here's a good article: https://learnopengl.com/Getting-started/Coordinate-Systems.

## Go further

- The Book of Shaders: https://thebookofshaders.com/
- ShaderToy: https://www.shadertoy.com/
- The Art of Code Youtube Channel: https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg
- Lewis Lepton Youtube Channel: https://www.youtube.com/channel/UC8Wzk_R1GoPkPqLo-obU_kQ
