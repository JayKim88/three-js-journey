https://github.com/JayKim88/three-js-journey/assets/55373668/9794fab0-92bf-4a76-8562-8962df8e3241

## Find a good model

There are many free models online, but the PMNDRS team created a place
where we can find a bunch of models ready to be used in Three.js and more specifically in R3F
: https://market.pmnd.rs

If you’re looking for a "Macbook" model, you should find this one https://market.pmnd.rs/model/macbook.

## PresentationControls

PresentationControls lets you manipulate the model instead of the camera.
We can rotate that model, and, when we release it, it goes back to its initial position.

PresentationControls is using [use-gesture](https://use-gesture.netlify.app/), a library to interact with elements using natural gestures (like drag and dropping)
and this library recommends adding the CSS property touch-action to none in order to fix weird behaviour on mobile when swiping.

## Font

Feel free to use any font you like and remember that you can download fonts from [Google Fonts](https://fonts.google.com/) with [Google Webfonts Helper](http://google-webfonts-helper.herokuapp.com/fonts).

### Some improvement ideas:

- Introduction animation where objects come up when ready and loaded;
- Sounds (don’t forget that the user needs to interact with the page through a click or a keyboard press before being able to play sounds);
- Make the camera zoom in on the screen when hovering over it (currently, the UX is really bad and it’s hard to read);
- Easter eggs;
- A better environment with objects in the back, particles, etc. (here’s a good inspiration https://codesandbox.io/s/interactive-spline-scene-live-html-f79ucc);
- Reflections on the screen (this one might be tricky because you need to create them inside the <Html> as HTML/CSS content because the iframe is on top of the WebGL);
- Improve the actual content of the iframe;
- Make it mobile friendly.
