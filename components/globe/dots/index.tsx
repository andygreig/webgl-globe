"use client";

import * as THREE from "three";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  calcPosFromLatLonRad,
  readMapImageData,
  visibilityForCoordinate,
} from "@/lib/utils/map";
import { DotLatLon } from "@/lib/types";
import { loadImage } from "@/lib/utils/load-image";
import { useFrame } from "@react-three/fiber";

// Custom shader for twinkle effect
const vertexShader = `
attribute float twinkleOffset;
attribute float twinkleDuration;
attribute float twinkleIntensity;

varying float vTwinkleOffset;
varying float vTwinkleDuration;
varying float vTwinkleIntensity;

void main() {
  vTwinkleOffset = twinkleOffset;
  vTwinkleDuration = twinkleDuration;
  vTwinkleIntensity = twinkleIntensity;
  
  vec3 transformed = position;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
uniform float time;
varying float vTwinkleOffset;
varying float vTwinkleDuration;
varying float vTwinkleIntensity;

void main() {
  float twinkleTime = time + vTwinkleOffset;
  float twinkleCycle = mod(twinkleTime / vTwinkleDuration, 1.0);
  float twinkleAlpha = sin(twinkleCycle * 3.14159) * vTwinkleIntensity;
  
  gl_FragColor = vec4(0.082, 0.345, 0.608, 0.7 * (0.3 + twinkleAlpha));
}
`;

interface DotsProps {
  dotSphereRadius: number;
  dotDensity?: number;
}

interface DotWithTwinkle {
  position: THREE.Vector3;
  twinkleOffset: number;
  twinkleDuration: number;
  twinkleIntensity: number;
}

const generateDots = (
  dotSphereRadius: number,
  dotDensity: number,
  mapLatLons: DotLatLon | null
): DotWithTwinkle[] => {
  const tempDots: DotWithTwinkle[] = [];
  const DEG_TO_RAD = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  for (let lat = 90, i = 0; lat > -90; lat--, i++) {
    const latRad = Math.abs(lat) * DEG_TO_RAD;
    const radius = Math.cos(latRad) * dotSphereRadius;
    const circumference = radius * TWO_PI;
    const dotsForLat = circumference * dotDensity;

    if (dotsForLat <= 0) continue; // Skip latitudes with no visible points

    for (let x = 0; x < dotsForLat; x++) {
      const long = -180 + (x * 360) / dotsForLat;

      // Early visibility check
      if (!visibilityForCoordinate(long, lat, mapLatLons)) continue;

      const [xPos, yPos, zPos] = calcPosFromLatLonRad(
        long,
        lat,
        dotSphereRadius
      );

      // Add twinkle parameters
      tempDots.push({
        position: new THREE.Vector3(xPos, yPos, zPos),
        twinkleOffset: Math.random() * 10, // Random start time
        twinkleDuration: 1 + Math.random(), // Variation in twinkle speed
        twinkleIntensity: 0.5 + Math.random() * 0.5, // Variation in twinkle intensity
      });
    }
  }

  return tempDots;
};

const Dots = ({ dotSphereRadius, dotDensity = 2.5 }: DotsProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const [dots, setDots] = useState<DotWithTwinkle[]>([]);

  const loadAndGenerateDots = useCallback(async () => {
    try {
      const imageData = await loadImage("/world_alpha_mini.jpg");
      const mapLatLons = readMapImageData(imageData);
      const generatedDots = generateDots(
        dotSphereRadius,
        dotDensity,
        mapLatLons
      );

      setDots(generatedDots);
    } catch (error) {
      console.error("Failed to load image:", error);
      return null;
    }
  }, []);

  // Use useEffect for image loading
  useEffect(() => {
    loadAndGenerateDots();
  }, [loadAndGenerateDots]);

  useEffect(() => {
    if (meshRef.current && dots.length > 0) {
      const matrix = new THREE.Matrix4();
      dots.forEach((dot, i) => {
        matrix.setPosition(dot.position);
        meshRef.current.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dots]);

  // Update instances with custom attributes
  useEffect(() => {
    if (meshRef.current && dots.length > 0) {
      const twinkleOffsets = new Float32Array(dots.length);
      const twinkleDurations = new Float32Array(dots.length);
      const twinkleIntensities = new Float32Array(dots.length);

      dots.forEach((dot, i) => {
        twinkleOffsets[i] = dot.twinkleOffset;
        twinkleDurations[i] = dot.twinkleDuration;
        twinkleIntensities[i] = dot.twinkleIntensity;
      });

      meshRef.current.geometry.setAttribute(
        "twinkleOffset",
        new THREE.InstancedBufferAttribute(twinkleOffsets, 1)
      );
      meshRef.current.geometry.setAttribute(
        "twinkleDuration",
        new THREE.InstancedBufferAttribute(twinkleDurations, 1)
      );
      meshRef.current.geometry.setAttribute(
        "twinkleIntensity",
        new THREE.InstancedBufferAttribute(twinkleIntensities, 1)
      );
    }
  }, [dots]);

  // Animate time uniform
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, dots.length]} // Geometry, Material, Count
    >
      <sphereGeometry args={[0.06, 4, 4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0.0 },
        }}
        transparent={true}
      />
    </instancedMesh>
  );
};

export { Dots };
