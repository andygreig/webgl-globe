import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  calcPosFromLatLonRad,
  visibilityForCoordinate,
  latLongToVector3,
  interpolateArc,
  readMapImageData,
} from "../map";

// ---------------------------------------------------------------------------
// calcPosFromLatLonRad
// ---------------------------------------------------------------------------
describe("calcPosFromLatLonRad", () => {
  it("places a point on the equator at lon=0 lat=0 on the positive-x axis", () => {
    // phi = (90 - 0) = 90°, theta = (0 + 180) = 180°
    // x = -(sin90 * cos180) = -(-1) = 1
    const [x, y, z] = calcPosFromLatLonRad(0, 0, 1);
    expect(x).toBeCloseTo(1, 5);
    expect(y).toBeCloseTo(0, 5);
    expect(z).toBeCloseTo(0, 5);
  });

  it("places the north pole at positive y", () => {
    const [x, y, z] = calcPosFromLatLonRad(0, 90, 1);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(1, 5);
    expect(z).toBeCloseTo(0, 5);
  });

  it("places the south pole at negative y", () => {
    const [x, y, z] = calcPosFromLatLonRad(0, -90, 1);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(-1, 5);
    expect(z).toBeCloseTo(0, 5);
  });

  it("scales with radius", () => {
    const [x1] = calcPosFromLatLonRad(0, 0, 1);
    const [x2] = calcPosFromLatLonRad(0, 0, 2);
    expect(x2).toBeCloseTo(x1 * 2, 5);
  });

  it("returns the same reference for repeated calls (cache hit)", () => {
    const first = calcPosFromLatLonRad(45, 45, 1);
    const second = calcPosFromLatLonRad(45, 45, 1);
    expect(first).toBe(second);
  });

  it("result lies on the unit sphere (magnitude ≈ radius)", () => {
    const radius = 1.5;
    const [x, y, z] = calcPosFromLatLonRad(30, 60, radius);
    const mag = Math.sqrt(x * x + y * y + z * z);
    expect(mag).toBeCloseTo(radius, 4);
  });
});

// ---------------------------------------------------------------------------
// visibilityForCoordinate
// ---------------------------------------------------------------------------
describe("visibilityForCoordinate", () => {
  const activeLatLon = {
    0: [-180, -90, 0, 90, 179],
    45: [-45, 0, 45],
  };

  it("returns false when activeLatLon is null", () => {
    expect(visibilityForCoordinate(0, 0, null)).toBe(false);
  });

  it("returns false when activeLatLon is undefined", () => {
    expect(visibilityForCoordinate(0, 0, undefined)).toBe(false);
  });

  it("returns false when the lat has no entries", () => {
    expect(visibilityForCoordinate(0, 10, activeLatLon)).toBe(false);
  });

  it("returns true for an exact lon match", () => {
    expect(visibilityForCoordinate(0, 0, activeLatLon)).toBe(true);
  });

  it("returns true for a lon within 0.5 of a stored value", () => {
    expect(visibilityForCoordinate(0.4, 0, activeLatLon)).toBe(true);
  });

  it("returns false for a lon more than 0.5 away from any stored value", () => {
    expect(visibilityForCoordinate(60, 0, activeLatLon)).toBe(false);
  });

  it("handles negative longitudes", () => {
    expect(visibilityForCoordinate(-45, 45, activeLatLon)).toBe(true);
  });

  it("returns false for an empty lat array", () => {
    expect(visibilityForCoordinate(0, 30, { 30: [] })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// latLongToVector3
// ---------------------------------------------------------------------------
describe("latLongToVector3", () => {
  it("returns a THREE.Vector3", () => {
    const v = latLongToVector3(0, 0);
    expect(v).toBeInstanceOf(THREE.Vector3);
  });

  it("defaults radius to 1", () => {
    const v = latLongToVector3(0, 0);
    expect(v.length()).toBeCloseTo(1, 5);
  });

  it("scales with radius", () => {
    const v1 = latLongToVector3(30, 45, 1);
    const v2 = latLongToVector3(30, 45, 2);
    expect(v2.length()).toBeCloseTo(v1.length() * 2, 4);
  });

  it("north pole maps to positive-y axis", () => {
    const v = latLongToVector3(90, 0);
    expect(v.x).toBeCloseTo(0, 5);
    expect(v.y).toBeCloseTo(1, 5);
    expect(v.z).toBeCloseTo(0, 5);
  });

  it("south pole maps to negative-y axis", () => {
    const v = latLongToVector3(-90, 0);
    expect(v.x).toBeCloseTo(0, 5);
    expect(v.y).toBeCloseTo(-1, 5);
    expect(v.z).toBeCloseTo(0, 5);
  });

  it("result magnitude equals radius", () => {
    const v = latLongToVector3(51.5, -0.1, 1.5);
    expect(v.length()).toBeCloseTo(1.5, 4);
  });
});

// ---------------------------------------------------------------------------
// interpolateArc
// ---------------------------------------------------------------------------
describe("interpolateArc", () => {
  const a = new THREE.Vector3(1, 0, 0);
  const b = new THREE.Vector3(0, 1, 0);

  it("does not mutate input vectors", () => {
    const aCopy = a.clone();
    const bCopy = b.clone();
    interpolateArc(a, b, 0.5);
    expect(a).toEqual(aCopy);
    expect(b).toEqual(bCopy);
  });

  it("returns a THREE.Vector3", () => {
    expect(interpolateArc(a, b, 0.5)).toBeInstanceOf(THREE.Vector3);
  });

  it("at t=0 result is close to start", () => {
    const result = interpolateArc(a, b, 0);
    expect(result.x).toBeCloseTo(a.x, 3);
    expect(result.y).toBeCloseTo(a.y, 3);
    expect(result.z).toBeCloseTo(a.z, 3);
  });

  it("at t=1 result is close to end", () => {
    const result = interpolateArc(a, b, 1);
    expect(result.x).toBeCloseTo(b.x, 3);
    expect(result.y).toBeCloseTo(b.y, 3);
    expect(result.z).toBeCloseTo(b.z, 3);
  });

  it("midpoint is symmetric for symmetric inputs", () => {
    const mid = interpolateArc(a, b, 0.5);
    const midReverse = interpolateArc(b, a, 0.5);
    expect(mid.x).toBeCloseTo(midReverse.x, 5);
    expect(mid.y).toBeCloseTo(midReverse.y, 5);
  });
});

// ---------------------------------------------------------------------------
// readMapImageData
// ---------------------------------------------------------------------------
describe("readMapImageData", () => {
  function makeImageData(
    pixels: { r: number; g: number; b: number; a?: number }[],
    width: number
  ): ImageData {
    const data = new Uint8ClampedArray(pixels.length * 4);
    pixels.forEach(({ r, g, b, a = 255 }, i) => {
      data[i * 4] = r;
      data[i * 4 + 1] = g;
      data[i * 4 + 2] = b;
      data[i * 4 + 3] = a;
    });
    // readMapImageData only reads .data and .width, so a plain object suffices
    return { data, width, height: pixels.length / width, colorSpace: "srgb" } as ImageData;
  }

  it("returns empty object for all bright pixels", () => {
    // 360 wide × 180 tall image, all white
    const total = 360 * 180;
    const pixels = Array.from({ length: total }, () => ({
      r: 255,
      g: 255,
      b: 255,
    }));
    const imgData = makeImageData(pixels, 360);
    const result = readMapImageData(imgData);
    expect(Object.keys(result).length).toBe(0);
  });

  it("records a dark pixel at the correct lat/lon", () => {
    // 360 wide × 180 tall image. lat=90 is row 0, lon=-180 is col 0.
    // We want lat=90, lon=0 → row=0, col=180
    const total = 360 * 180;
    const pixels = Array.from({ length: total }, () => ({
      r: 255,
      g: 255,
      b: 255,
    }));
    const targetIndex = 0 * 360 + 180; // row 0, col 180
    pixels[targetIndex] = { r: 0, g: 0, b: 0 };

    const imgData = makeImageData(pixels, 360);
    const result = readMapImageData(imgData);

    expect(result[90]).toBeDefined();
    expect(result[90]).toContain(0); // lon=0
  });

  it("ignores pixels that are dark in only one channel", () => {
    const total = 360 * 180;
    const pixels = Array.from({ length: total }, () => ({
      r: 255,
      g: 255,
      b: 255,
    }));
    // Red channel low but green/blue bright — should NOT be detected
    const targetIndex = 0 * 360 + 180;
    pixels[targetIndex] = { r: 10, g: 200, b: 200 };

    const imgData = makeImageData(pixels, 360);
    const result = readMapImageData(imgData);
    expect(Object.keys(result).length).toBe(0);
  });

  it("records multiple dark pixels on the same lat row", () => {
    const total = 360 * 180;
    const pixels = Array.from({ length: total }, () => ({
      r: 255,
      g: 255,
      b: 255,
    }));
    // lat=89 → row=1; lon=-180 → col=0, lon=-90 → col=90
    pixels[1 * 360 + 0] = { r: 0, g: 0, b: 0 };
    pixels[1 * 360 + 90] = { r: 0, g: 0, b: 0 };

    const imgData = makeImageData(pixels, 360);
    const result = readMapImageData(imgData);

    expect(result[89]).toBeDefined();
    expect(result[89]).toContain(-180);
    expect(result[89]).toContain(-90);
  });
});
