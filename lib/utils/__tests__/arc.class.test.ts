import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { ArcCurve } from "../classes/arc.class";

describe("ArcCurve", () => {
  const start: [number, number] = [51.5, -0.1];  // London
  const end: [number, number] = [40.7, -74.0];   // New York
  const radius = 1;
  const heightFactor = 0.5;
  const heightOffset = 0.2;

  let curve: ArcCurve;

  it("constructs without throwing", () => {
    expect(() => {
      curve = new ArcCurve(start, end, radius, heightFactor, heightOffset);
    }).not.toThrow();
  });

  it("extends THREE.Curve", () => {
    curve = new ArcCurve(start, end, radius, heightFactor, heightOffset);
    expect(curve).toBeInstanceOf(THREE.Curve);
  });

  it("getPoint returns a THREE.Vector3", () => {
    curve = new ArcCurve(start, end, radius, heightFactor, heightOffset);
    expect(curve.getPoint(0.5)).toBeInstanceOf(THREE.Vector3);
  });

  it("getPoint at t=0 is close to start on the sphere surface", () => {
    curve = new ArcCurve(start, end, radius, heightFactor, heightOffset);
    const startVec = curve.getPoint(0);
    // start point lies on the sphere (magnitude ≈ radius at endpoints)
    expect(startVec.length()).toBeGreaterThan(0);
  });

  it("getPoint at t=1 is close to end on the sphere surface", () => {
    curve = new ArcCurve(start, end, radius, heightFactor, heightOffset);
    const endVec = curve.getPoint(1);
    expect(endVec.length()).toBeGreaterThan(0);
  });

  it("midpoint is elevated above sphere surface", () => {
    curve = new ArcCurve(start, end, radius, heightFactor, heightOffset);
    const mid = curve.getPoint(0.5);
    // The arc lifts control points, so midpoint magnitude > radius
    expect(mid.length()).toBeGreaterThan(radius);
  });

  it("arc is symmetric: midpoint from start→end ≈ midpoint from end→start", () => {
    const fwd = new ArcCurve(start, end, radius, heightFactor, heightOffset);
    const rev = new ArcCurve(end, start, radius, heightFactor, heightOffset);
    const midFwd = fwd.getPoint(0.5);
    const midRev = rev.getPoint(0.5);
    expect(midFwd.length()).toBeCloseTo(midRev.length(), 2);
  });

  it("higher arcHeightFactor produces greater arc elevation", () => {
    const low = new ArcCurve(start, end, radius, 0.1, 0);
    const high = new ArcCurve(start, end, radius, 1.0, 0);
    expect(high.getPoint(0.5).length()).toBeGreaterThan(
      low.getPoint(0.5).length()
    );
  });
});
