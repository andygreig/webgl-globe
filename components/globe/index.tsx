"use client";

import * as THREE from "three";
import { Group } from "three";

import { GlobeRouteAnimation } from "@/lib/types";
import { Dots } from "./dots";
import { AnimationGroup } from "./animation-group";
import { forwardRef } from "react";

interface GlobeProps {
  position: [x: number, y: number, z: number];
  routes: GlobeRouteAnimation[][];
  sphereSize?: number;
  dotDensity?: number;
  tilt?: number;
}

const Globe = forwardRef<Group, GlobeProps>(
  ({ position, routes, sphereSize = 19, dotDensity = 3, tilt = 0.55 }, ref) => {
    return (
      <group ref={ref} position={position} rotation={[tilt, 0, 0]}>
        <mesh>
          <sphereGeometry args={[sphereSize, 35, 35]} />
          <meshStandardMaterial
            color={0x0b2636}
            transparent={true}
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
        {routes.map((route, i) => (
          <AnimationGroup key={i} routes={route} sphereSize={sphereSize} />
        ))}
        <Dots dotSphereRadius={sphereSize + 0.1} dotDensity={dotDensity} />
      </group>
    );
  }
);

// Add a display name for better debugging
Globe.displayName = "Globe";

export { Globe };
