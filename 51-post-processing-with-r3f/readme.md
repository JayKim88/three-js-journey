`npm install @react-three/postprocessing@2.14`

`npm install postprocessing@6.31`

Post processing introduces the concept of passes and effects
to extend the common rendering workflow with fullscreen image manipulation tools.

multi-sampling is used to prevent the aliasing effect (the little stairs on the edges of geometries).

## Post Processing:

The repository: https://github.com/pmndrs/postprocessing
The documentation (generated from the code): https://pmndrs.github.io/postprocessing/public/docs/
A demo page (you can change the effect within the debug UI): https://pmndrs.github.io/postprocessing/public/demo/

## React-postprocessing:

The repository: https://github.com/pmndrs/reactpostprocessing
The list of effects implemented from postprocessing to React postprocessing: https://github.com/pmndrs/postprocessing#included-effects
The documentation (very similar to the repo, but more user-friendly): https://docs.pmnd.rs/react-postprocessing/introduction

## Blending

There is a special attribute named blendFunction available within Vignette but also with every other effects to come.

blendFunction works a bit like the blending you can find in image editing softwares (like Photoshop). It’s how the color of what we are drawing merges with what’s behind.

## Bloom Effect

the default configuration of Bloom makes objects glow only when their color channels go beyond the 1 threshold.

If you remember from the previous lessons, a tone mapping is applied by default. While it makes the colors look great, the tone mapping will clamp the colors between 0 and 1.

## DepthOfField effect

This effect will blur what’s closer or further from a set distance.

## SSR Effect

React Three Fiber Examples: https://docs.pmnd.rs/react-three-fiber/getting-started/examples

Code Ref: https://codesandbox.io/s/ssr-test-8pbw1f?file=/src/App.js:0-31

## Custom Effects

Post Processing custom effect: https://github.com/pmndrs/postprocessing/wiki/Custom-Effects
React-postprocessing custom effect: https://github.com/pmndrs/react-postprocessing/blob/master/api.md#custom-effects

### fragmentShader

we are using the WebGL 2 syntax where we can specify more information associated with each parameter:

- const means that the parameter is not writable.
- in means that it’s a copy of the actual variable and changing it won’t affect the initial variable sent when calling the function.
- out means that changing this value will change the variable sent when calling the function.

It prevents us from making mistakes but also gives us a hint about what variables we need to change:

- inputColor contains the current color for that pixel which is defined by the previous effects.
- uv contains the render coordinates (from 0,0 at the bottom left corner to 1,1 in the top right corner).
- outputColor is what we need to change in order to apply the effect.

# Custom Effect is not working at all. Need to solve Next time!!!
