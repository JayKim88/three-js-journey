https://github.com/JayKim88/three-js-journey/assets/55373668/9794fab0-92bf-4a76-8562-8962df8e3241

```js
import {
  useGLTF,
  OrbitControls,
  Environment,
  Float,
  PresentationControls,
  ContactShadows,
  Html,
  Text,
} from "@react-three/drei";

export default function Experience() {
  const computer = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf"
  );
  return (
    <>
      <Environment preset="city" />
      <color args={["#241a1a"]} attach="background" />
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]} // vertical limitation
        azimuth={[-1, 0.75]} // horizontal limitation
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }} // return to initial position
      >
        <Float rotationIntensity={0.4}>
          {/* screen light */}
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color="#e5f6df"
            rotation={[-0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />
          <primitive object={computer.scene} position-y={-1.2}>
            <Html
              transform // transform itself as if it were part of the scene and not just follow a 3D point.
              wrapperClass="htmlScreen" // this is for css change
              distanceFactor={1.17} // resize
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
            >
              <iframe src="https://jay-portfolio-487aa.web.app/" />
            </Html>
          </primitive>
          <Text
            font="./bangers-v20-latin-regular.woff"
            fontSize={1}
            position={[2, 0.55, 0.25]}
            rotation-y={-1.25}
          >
            JAY KIM
          </Text>
        </Float>
      </PresentationControls>
      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} />
    </>
  );
}
```

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

<br/>
<br/>

### Some improvement ideas:

- Introduction animation where objects come up when ready and loaded;
- Sounds (don’t forget that the user needs to interact with the page through a click or a keyboard press before being able to play sounds);
- Make the camera zoom in on the screen when hovering over it (currently, the UX is really bad and it’s hard to read);
- Easter eggs;
- A better environment with objects in the back, particles, etc. (here’s a good inspiration https://codesandbox.io/s/interactive-spline-scene-live-html-f79ucc);
- Reflections on the screen (this one might be tricky because you need to create them inside the <Html> as HTML/CSS content because the iframe is on top of the WebGL);
- Improve the actual content of the iframe;
- Make it mobile friendly.
