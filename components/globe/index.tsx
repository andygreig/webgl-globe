"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

import { Dots } from "./dots";
import { Arc } from "./arc";
// import { DotsAlt } from "./dots-alt";

interface GlobeProps {
  position: [x: number, y: number, z: number];
}

const SPHERE_SIZE = 19;

const Globe = ({ position }: GlobeProps) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(undefined);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta;
    }
  });

  return (
    <>
      <mesh position={position} ref={ref}>
        <sphereGeometry args={[SPHERE_SIZE, 35, 35]} />
        <meshStandardMaterial
          color={0x0b2636}
          transparent={true}
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* <DotsAlt /> */}
      <Arc
        start={[40.7128, -74.006]}
        end={[35.6762, 139.6503]}
        radius={SPHERE_SIZE}
        arcHeightFactor={0.25}
      />
      <Arc
        start={[-37.8136, 144.963]}
        end={[1.352, 103.819]}
        radius={SPHERE_SIZE}
        arcHeightFactor={0.25}
      />
      <Arc
        start={[-37.8136, 144.963]}
        end={[25.204, 55.27]}
        radius={SPHERE_SIZE}
        arcHeightFactor={0.25}
      />
      <Dots dotSphereRadius={19.1} dotDensity={2.2} />
    </>
  );
};

export { Globe };
