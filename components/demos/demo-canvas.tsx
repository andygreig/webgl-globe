"use client";

import { Canvas } from "@react-three/fiber";

export function DemoCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        gl={{ antialias: false }}
        camera={{ fov: 45, near: 1, far: 500, position: [0, 0, 65] }}
      >
        {children}
      </Canvas>
    </div>
  );
}
