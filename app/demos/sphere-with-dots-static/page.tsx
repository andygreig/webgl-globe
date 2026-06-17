"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Group } from "three";

import { DemoCanvas } from "@/components/demos/demo-canvas";
import { SceneLights } from "@/components/demos/scene-lights";
import { DotsStatic } from "@/components/demos/dots-static";
import { GLOBE_DEFAULTS } from "@/lib/config";

function Scene() {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y -= GLOBE_DEFAULTS.rotationSpeed;
  });

  return (
    <>
      <group ref={ref} rotation={[GLOBE_DEFAULTS.tilt, 0, 0]}>
        <mesh>
          <sphereGeometry args={[GLOBE_DEFAULTS.sphereSize, 35, 35]} />
          <meshStandardMaterial color="#888888" side={THREE.DoubleSide} />
        </mesh>
        <DotsStatic
          dotSphereRadius={GLOBE_DEFAULTS.sphereSize + 0.1}
          dotColor="#ffffff"
        />
      </group>
      <OrbitControls enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
    </>
  );
}

export default function SphereWithDotsStatic() {
  return (
    <DemoCanvas>
      <SceneLights ambientIntensity={1} directionalIntensity={4} />
      <Scene />
    </DemoCanvas>
  );
}
