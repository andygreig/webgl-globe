import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { OrbitControls } from "@react-three/drei";
import { Globe } from "../globe";
import { GlobeRouteAnimation } from "@/lib/types";
import { GLOBE_DEFAULTS } from "@/lib/config";

interface RotatingGlobeProps {
  routes: GlobeRouteAnimation[][];
  rotationSpeed?: number;
  paused?: boolean;
  tilt?: number;
  sphereColor?: string;
  dotDensity?: number;
  dotColor?: string;
  twinkleStrength?: number;
  arcColor?: string;
  pathColor?: string;
  animationSpeed?: number;
}

const RotatingGlobe = ({
  routes,
  rotationSpeed = GLOBE_DEFAULTS.rotationSpeed,
  paused = false,
  tilt = GLOBE_DEFAULTS.tilt,
  sphereColor = GLOBE_DEFAULTS.sphereColor,
  dotDensity = GLOBE_DEFAULTS.dotDensity,
  dotColor = GLOBE_DEFAULTS.dotColor,
  twinkleStrength = GLOBE_DEFAULTS.twinkleStrength,
  arcColor = GLOBE_DEFAULTS.arcColor,
  pathColor = GLOBE_DEFAULTS.pathColor,
  animationSpeed = GLOBE_DEFAULTS.animationSpeed,
}: RotatingGlobeProps) => {
  const globeRef = useRef<Group>(null);

  useFrame(() => {
    if (globeRef.current && !paused) {
      globeRef.current.rotation.y -= rotationSpeed;
    }
  });

  return (
    <>
      <Globe
        ref={globeRef}
        position={[0, 0, 0]}
        routes={routes}
        tilt={tilt}
        sphereColor={sphereColor}
        dotDensity={dotDensity}
        dotColor={dotColor}
        twinkleStrength={twinkleStrength}
        arcColor={arcColor}
        pathColor={pathColor}
        animationSpeed={animationSpeed}
      />
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
