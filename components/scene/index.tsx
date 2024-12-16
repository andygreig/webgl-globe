"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Globe } from "../globe";

const Scene = () => {
  return (
    <div
      className="App"
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Canvas
        camera={{
          fov: 30,
          near: 1,
          far: 1000,
          zoom: 1,
          position: [0, 0, 100],
        }}
      >
        <Globe position={[0, 0, 0]} />
        <ambientLight intensity={Math.PI} />
        <hemisphereLight
          color={0xffffbb}
          groundColor={0x080820}
          intensity={1.5}
        />
        <pointLight
          position={[-50, 0, 60]}
          decay={0}
          intensity={Math.PI}
          distance={100}
          color={0x081b26}
        />
        <OrbitControls enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export { Scene };
