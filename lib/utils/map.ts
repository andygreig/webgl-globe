import * as THREE from "three";

import { DotLatLon } from "../types";

export const readMapImageData = (imageData: ImageData): DotLatLon => {
  const activeLatLon: DotLatLon = {};
  const { data } = imageData;
  const width = imageData.width; // Assuming standard world map dimensions

  for (let lat = 90; lat > -90; lat--) {
    const latRow: number[] = [];

    for (let lon = -180; lon < 180; lon++) {
      const pixelIndex = ((90 - lat) * width + (lon + 180)) * 4;

      // Ensure we don't go out of bounds
      if (pixelIndex >= data.length) break;

      const red = data[pixelIndex];
      const green = data[pixelIndex + 1];
      const blue = data[pixelIndex + 2];

      // Dark pixel detection
      if (red < 80 && green < 80 && blue < 80) {
        latRow.push(lon);
      }
    }

    if (latRow.length) {
      activeLatLon[lat] = latRow;
    }
  }

  return activeLatLon;
};

// Latitude/Longitude to 3D coordinates conversion
export const calcPosFromLatLonRad = (() => {
  const cache = new Map<string, [number, number, number]>();

  return (
    lon: number,
    lat: number,
    radius: number
  ): [number, number, number] => {
    const DEG_TO_RAD = Math.PI / 180; // Precompute constant
    const cacheKey = `${lon},${lat},${radius}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const phi = (90 - lat) * DEG_TO_RAD;
    const theta = (lon + 180) * DEG_TO_RAD;

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    const result: [number, number, number] = [x, y, z];

    // LRU cache with limited size to prevent memory growth
    if (cache.size > 10000) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }

    cache.set(cacheKey, result);
    return result;
  };
})();

// Optimized visibility check with early returns and faster lookup
export const visibilityForCoordinate = (
  lon: number,
  lat: number,
  activeLatLon?: { [key: number]: number[] } | null
): boolean => {
  // Early returns for invalid inputs
  if (!activeLatLon || !activeLatLon[lat]?.length) return false;

  const latLons = activeLatLon[lat];

  // Binary search for faster closest point finding
  let left = 0;
  let right = latLons.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midLon = latLons[mid];

    if (Math.abs(midLon - lon) < 0.5) return true;

    if (midLon < lon) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return false;
};

export const latLongToVector3 = (
  lat: number,
  lon: number,
  radius = 1
): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Interpolate between points on great circle
export const interpolateArc = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  t: number
): THREE.Vector3 => {
  // Create new vectors to avoid mutation
  const startVec = new THREE.Vector3(start.x, start.y, start.z);
  const endVec = new THREE.Vector3(end.x, end.y, end.z);

  const v = new THREE.Vector3().subVectors(endVec, startVec);
  const angle = (v.length() * Math.PI) / 180;

  const interpolated = new THREE.Vector3()
    .addVectors(
      startVec.multiplyScalar(Math.sin((1 - t) * angle)),
      endVec.multiplyScalar(Math.sin(t * angle))
    )
    .divideScalar(Math.sin(angle));

  return interpolated;
};
