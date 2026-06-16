"use client";

import * as THREE from "three";
import { Group } from "three";

import { GlobeRouteAnimation } from "@/lib/types";
import { Dots } from "./dots";
import { AnimationGroup } from "./animation-group";
import { forwardRef } from "react";
import { GLOBE_DEFAULTS } from "@/lib/config";

interface GlobeProps {
  position: [x: number, y: number, z: number];
  routes: GlobeRouteAnimation[][];
  sphereSize?: number;
  dotDensity?: number;
  tilt?: number;
  sphereColor?: string;
  dotColor?: string;
  twinkleStrength?: number;
  arcColor?: string;
  pathColor?: string;
  animationSpeed?: number;
}

const Globe = forwardRef<Group, GlobeProps>(
  (
    {
      position,
      routes,
      sphereSize = GLOBE_DEFAULTS.sphereSize,
      dotDensity = GLOBE_DEFAULTS.dotDensity,
      tilt = GLOBE_DEFAULTS.tilt,
      sphereColor = GLOBE_DEFAULTS.sphereColor,
      dotColor = GLOBE_DEFAULTS.dotColor,
      twinkleStrength = GLOBE_DEFAULTS.twinkleStrength,
      arcColor = GLOBE_DEFAULTS.arcColor,
      pathColor = GLOBE_DEFAULTS.pathColor,
      animationSpeed = GLOBE_DEFAULTS.animationSpeed,
    },
    ref
  ) => {
    return (
      <group ref={ref} position={position} rotation={[tilt, 0, 0]}>
        <mesh>
          <sphereGeometry args={[sphereSize, 35, 35]} />
          <meshStandardMaterial
            color={sphereColor}
            transparent={true}
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
        {routes.map((route, i) => (
          <AnimationGroup
            key={i}
            routes={route}
            sphereSize={sphereSize}
            arcColor={arcColor}
            pathColor={pathColor}
            animationSpeed={animationSpeed}
          />
        ))}
        <Dots
          dotSphereRadius={sphereSize + 0.1}
          dotDensity={dotDensity}
          dotColor={dotColor}
          twinkleStrength={twinkleStrength}
        />
      </group>
    );
  }
);

Globe.displayName = "Globe";

export { Globe };
