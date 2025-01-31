"use client";

import { Canvas } from "@react-three/fiber";

import { RotatingGlobe } from "../rotating-globe";
import { routes as oceanRoutes } from "./ocean-animations";
import { routes as airRoutes } from "./air-animations";

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
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          near: 1,
          far: 500,
          zoom: 1,
          position: [0, 0, 65],
        }}
      >
        <RotatingGlobe
          routes={[airRoutes, oceanRoutes]}
          rotationSpeed={0.0012}
        />
      </Canvas>
    </div>
  );
};

export { Scene };
