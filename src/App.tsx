import { Environment, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import LabyrinthMap from "./LabyrinthMap.jsx";

function App() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [0, 30, 0],

        fov: 25,
        near: 1,
        far: 40,
      }}
    >
      <Environment preset="park" />
      <OrbitControls makeDefault />
      <Sky />
      <group rotation={[0, Math.PI / 2, 0]}>
        <LabyrinthMap />
      </group>
    </Canvas>
  );
}

export default App;
