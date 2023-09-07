varying vec3 vColor;

void main()
{

    // Disc
    // vec2(0.5) - center of particle
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength); 
    // strength = 1.0 - strength; // flip the flled part

    // Diffuse point
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0; // make reaching 1.0 early with strong color
    // strength = 1.0 - strength;

    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final color - black to vColor up to strength
    vec3 color = mix(vec3(0.0), vColor, strength);
         
    // access to the UV in the fragment shader with gl_PointCoord. This variable is specific to the particles.
    gl_FragColor = vec4(color, 1.0);
}
