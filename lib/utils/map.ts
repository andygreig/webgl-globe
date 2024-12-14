import { DotLatLon } from "../types";

export const readMapImageData = (imageData: ImageData): DotLatLon => {
  const activeLatLon: DotLatLon = {};

  for (
    let i = 0, lon = -180, lat = 90;
    i < imageData.data.length;
    i += 4, lon++
  ) {
    if (!activeLatLon[lat]) activeLatLon[lat] = [];

    const red = imageData.data[i];
    const green = imageData.data[i + 1];
    const blue = imageData.data[i + 2];

    if (red < 80 && green < 80 && blue < 80) activeLatLon[lat].push(lon);

    if (lon === 180) {
      lon = -180;
      lat--;
    }
  }

  return activeLatLon;
};

// Latitude/Longitude to 3D coordinates conversion
export const calcPosFromLatLonRad = (
  lon: number,
  lat: number,
  radius: number
): [x: number, y: number, z: number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
};

// Visibility check function
export const visibilityForCoordinate = (
  lon: number,
  lat: number,
  activeLatLon?: { [key: number]: number[] } | null
) => {
  let visible = false;

  if (!activeLatLon?.[lat]?.length) return visible;

  const closest = activeLatLon[lat].reduce((prev, curr) => {
    return Math.abs(curr - lon) < Math.abs(prev - lon) ? curr : prev;
  });

  if (Math.abs(lon - closest) < 0.5) visible = true;

  return visible;
};
