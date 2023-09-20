import { OrbitControls } from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";

export default function Experience() {
  const { perfVisible } = useControls({
    perfVisible: true,
  });
  const { position, color, visible } = useControls("sphere", {
    position: {
      value: { x: -2, y: 0 },
      step: 0.01,
      joystick: "invertY",
    },
    color: "#ff0000",
    /*
    'rgb(255, 0, 0)'
    'orange'    
    'hsl(100deg, 100%, 50%)'
    'hsla(100deg, 100%, 50%, 0.5)'
    { r: 200, g: 106, b: 125, a: 0.4 }
    */
    visible: true,
    myInterval: {
      min: 0,
      max: 10,
      value: [4, 5],
    },
    clickMe: button(() => {
      console.log("button clicked!");
    }),
    choice: { options: ["a", "b", "c"] },
  });

  const { scale } = useControls("cube", {
    scale: {
      value: 1.5,
      step: 0.01,
      min: 0,
      max: 5,
    },
  });

  return (
    <>
      {/* R3F-Perf displays a crazy amount of useful information. draw calls, the memory usage, time to render, etc. */}
      {perfVisible && <Perf position="top-left" />}
      <OrbitControls makeDefault />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <mesh position={[position.x, position.y, 0]} visible={visible}>
        <sphereGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position-x={2} scale={scale}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
