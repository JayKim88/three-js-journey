import Sizes from "./Utils/Sizes";

export default class Experience {
  constructor(canvas) {
    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;
    console.log(this.canvas);

    // Setup
    this.sizes = new Sizes();

    console.log("ddd", this.sizes.height);
  }
}
