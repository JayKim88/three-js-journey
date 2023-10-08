import { Effect } from "postprocessing";

/*
postprocessing will take our shader and merge it with the other effect shaders.
Our shader can be implemented in a function that must be named mainImage, 
return void and have the following very specific parameters
*/

const fragmentShader = /* glsl */ `
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec2 outputColor) 
    {
        vec4 color = inputColor;
        outputColor = color;
    }
`;

export default class DrunkEffect extends Effect {
  constructor(props) {
    super("sdfasdfas", fragmentShader, {});
  }
}
