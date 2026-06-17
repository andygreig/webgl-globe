"use client";

import * as THREE from "three";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  calcPosFromLatLonRad,
  readMapImageData,
  visibilityForCoordinate,
} from "@/lib/utils/map";
import { loadImage } from "@/lib/utils/load-image";
import { GLOBE_DEFAULTS } from "@/lib/config";

interface DotsStaticProps {
  dotSphereRadius: number;
  dotDensity?: number;
  dotColor?: string;
}

const DotsStatic = ({
  dotSphereRadius,
  dotDensity = GLOBE_DEFAULTS.dotDensity,
  dotColor = "#ffffff",
}: DotsStaticProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);

  const load = useCallback(async () => {
    const imageData = await loadImage("/world_alpha_mini.jpg");
    const mapLatLons = readMapImageData(imageData);

    const result: THREE.Vector3[] = [];
    const DEG_TO_RAD = Math.PI / 180;
    const TWO_PI = Math.PI * 2;

    for (let lat = 90; lat > -90; lat--) {
      const latRad = Math.abs(lat) * DEG_TO_RAD;
      const radius = Math.cos(latRad) * dotSphereRadius;
      const dotsForLat = radius * TWO_PI * dotDensity;

      for (let x = 0; x < dotsForLat; x++) {
        const lon = -180 + (x * 360) / dotsForLat;
        if (!visibilityForCoordinate(lon, lat, mapLatLons)) continue;
        const [xPos, yPos, zPos] = calcPosFromLatLonRad(lon, lat, dotSphereRadius);
        result.push(new THREE.Vector3(xPos, yPos, zPos));
      }
    }

    setPositions(result);
  }, [dotSphereRadius, dotDensity]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!meshRef.current || positions.length === 0) return;
    const matrix = new THREE.Matrix4();
    positions.forEach((pos, i) => {
      matrix.setPosition(pos);
      meshRef.current.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <sphereGeometry args={[0.06, 4, 4]} />
      <meshStandardMaterial color={dotColor} />
    </instancedMesh>
  );
};

export { DotsStatic };
