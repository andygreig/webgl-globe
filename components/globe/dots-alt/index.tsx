import * as THREE from "three";
import { useEffect, useState } from "react";

const DOT_COUNT = 60000;

// Point to UV conversion
const pointToUV = (point: THREE.Vector3) => {
  // Convert 3D Cartesian coordinates to spherical coordinates
  const radius = point.length();
  const theta = Math.atan2(point.z, point.x);
  const phi = Math.acos(point.y / radius);

  // Convert to UV coordinates
  // Longitude: invert and shift to align with typical map projection
  const u = 1 - (theta + Math.PI) / (2 * Math.PI);
  // Latitude: map from top to bottom of image
  const v = phi / Math.PI;

  return [u, v];
};

// Sample image at UV coordinates
const sampleImage = (uv: number[], imageData: ImageData) => {
  const x = Math.floor(uv[0] * imageData.width);
  const y = Math.floor(uv[1] * imageData.height);

  // Ensure coordinates are within image bounds
  const clampedX = Math.min(Math.max(x, 0), imageData.width - 1);
  const clampedY = Math.min(Math.max(y, 0), imageData.height - 1);

  const index = (clampedY * imageData.width + clampedX) * 4;

  // For black and white image, check if pixel is not white (black or gray)
  // Threshold can be adjusted based on your specific image
  const brightness = imageData.data[index];
  return brightness < 240; // Consider anything not near white as land
};

// Process dots based on map image
const processDots = (imageData: ImageData) => {
  const dots = [];
  const vector = new THREE.Vector3();

  for (let i = DOT_COUNT; i >= 0; i--) {
    const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
    const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;

    // Calculate position on sphere with radius 19.2
    vector.setFromSphericalCoords(19.2, phi, theta);

    // Convert point to UV
    const uv = pointToUV(vector);

    // Sample image at UV
    const isLand = sampleImage(uv, imageData);

    // Only add dot if it has color data (not transparent)
    if (isLand) {
      dots.push(vector.x, vector.y, vector.z);
    }
  }

  return new Float32Array(dots);
};

const DotsAlt = () => {
  const [landDots, setLandDots] = useState<Float32Array | null>(null);

  useEffect(() => {
    // Load and process the map image
    const processMapImage = async () => {
      const imageLoader = new THREE.ImageLoader();

      imageLoader.load("/world_alpha_mini.jpg", (mapImage) => {
        // Create a canvas to get image data
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = mapImage.width;
          canvas.height = mapImage.height;
          context.drawImage(mapImage, 0, 0, mapImage.width, mapImage.height);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const filteredDots = processDots(imageData);
          setLandDots(filteredDots);
        }
      });
    };

    processMapImage();
  }, []);

  // If dots haven't been processed yet, return null
  if (!landDots) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={landDots}
          count={landDots.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.25} sizeAttenuation />
    </points>
  );
};

export { DotsAlt };
