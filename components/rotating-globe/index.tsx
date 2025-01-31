import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { OrbitControls } from "@react-three/drei";
import { Globe } from "../globe";
import { GlobeRouteAnimation } from "@/lib/types";

interface RotatingGlobeProps {
  routes: GlobeRouteAnimation[][];
  rotationSpeed?: number;
}

// Create a separate component for the rotating globe
const RotatingGlobe = ({
  routes,
  rotationSpeed = 0.002,
}: RotatingGlobeProps) => {
  const globeRef = useRef<Group>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y -= rotationSpeed;
    }
  });

  return (
    <>
      <Globe ref={globeRef} position={[0, 0, 0]} routes={routes} tilt={0.3} />
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
    </>
  );
};

export { RotatingGlobe };
