"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

import { DotShaderComponent } from "./dot-shader";
import { loadImage } from "@/lib/utils/load-image";
import {
  calcPosFromLatLonRad,
  readMapImageData,
  visibilityForCoordinate,
} from "@/lib/utils/map";
import { DotLatLon } from "@/lib/types";

interface DotProps {
  position: THREE.Vector3;
}

/*
const DebugDot = ({ position }: { position: THREE.Vector3 }) => {
  console.log(position)
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 5, 5]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
};*/

const Dot = ({ position }: DotProps) => {
  const ref = useRef<Mesh>(undefined);

  return (
    <mesh ref={ref} position={position}>
      <circleGeometry args={[0.1, 5]} />
      <DotShaderComponent />
    </mesh>
  );
};

interface DotsProps {
  dotSphereRadius: number;
  dotDensity?: number;
}

const Dots = ({ dotSphereRadius, dotDensity = 2.5 }: DotsProps) => {
  const [mapLatLons, setMapLatLons] = useState<DotLatLon | null>(null);
  const [dots, setDots] = useState<
    { position: THREE.Vector3; material: THREE.Material }[]
  >([]);

  // Asynchronously load the image when the component mounts
  useEffect(() => {
    const load = async () => {
      try {
        const data = await loadImage('/world_alpha_mini.jpg');
        const mapLatLons = readMapImageData(data);
        setMapLatLons(mapLatLons); // Set mapLatLons once the image is loaded
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    };
    load();
  }, []); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    const generateDots = () => {
      const tempDots: { position: THREE.Vector3; material: THREE.Material }[] =
        [];

      for (let lat = 90, i = 0; lat > -90; lat--, i++) {
        const radius =
          Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius;
        const circumference = radius * Math.PI * 2;
        const dotsForLat = circumference * dotDensity;

        for (let x = 0; x < dotsForLat; x++) {
          const long = -180 + (x * 360) / dotsForLat;
          // Log latitude and longitude
          //console.log(`Lat: ${lat}, Long: ${long}`);
          // Visibility check based on activeLatLon
          if (!visibilityForCoordinate(long, lat, mapLatLons)) continue;

          const vector = new THREE.Vector3();
          const vectorPos = calcPosFromLatLonRad(long, lat, dotSphereRadius);
          vector.set(...vectorPos);

          // Log the position of the dot
          //console.log(`Position: ${vector.x}, ${vector.y}, ${vector.z}`);
          // Create material (you can replace this with custom logic if needed)
          const material = createMaterial(i);

          tempDots.push({ position: vector, material });
        }
      }

      setDots(tempDots);
    };

    generateDots();
  }, [dotSphereRadius, mapLatLons, dotDensity]);

  const createMaterial = (i: number): THREE.MeshBasicMaterial => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(`hsl(${(i * 10) % 360}, 100%, 50%)`),
    });
  };

  /*return dots.map((dot, index) => (
    <DebugDot key={`debug-${index}`} position={dot.position} />
  ))*/
  return dots.map((dot, index) => <Dot key={index} position={dot.position} />);
};

/// Exported component

interface GlobeProps {
  position: [x: number, y: number, z: number];
}

const Globe = ({ position }: GlobeProps) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(undefined);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta;
    }
  });
  // Return the view, these are regular Threejs elements expressed in JSX

  return (
    <>
      <mesh position={position} ref={ref}>
        <sphereGeometry args={[19, 35, 35]} />
        <meshStandardMaterial
          color={0x0b2636}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      <Dots dotSphereRadius={19.2} dotDensity={2.5} />
    </>
  );
};

export { Globe };
