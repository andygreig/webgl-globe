import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { PathCurve } from "../classes/path.class";

const LONDON: [number, number] = [51.5, -0.1];
const PARIS: [number, number] = [48.8, 2.3];
const BERLIN: [number, number] = [52.5, 13.4];
const MADRID: [number, number] = [40.4, -3.7];

describe("PathCurve", () => {
  describe("construction", () => {
    it("constructs with 2 points (fewer than 4)", () => {
      expect(
        () => new PathCurve([LONDON, PARIS], 1)
      ).not.toThrow();
    });

    it("constructs with 4+ points and runs smooth path generation", () => {
      expect(
        () => new PathCurve([LONDON, PARIS, BERLIN, MADRID], 1)
      ).not.toThrow();
    });

    it("constructs with custom smoothness", () => {
      expect(
        () => new PathCurve([LONDON, PARIS, BERLIN, MADRID], 1, 0.1)
      ).not.toThrow();
    });
  });

  describe("getPoint", () => {
    const points = [LONDON, PARIS, BERLIN, MADRID];

    it("returns a THREE.Vector3", () => {
      const curve = new PathCurve(points, 1);
      expect(curve.getPoint(0)).toBeInstanceOf(THREE.Vector3);
    });

    it("t=0 returns a non-zero vector", () => {
      const curve = new PathCurve(points, 1);
      const p = curve.getPoint(0);
      expect(p.length()).toBeGreaterThan(0);
    });

    it("t=1 returns a non-zero vector", () => {
      const curve = new PathCurve(points, 1);
      const p = curve.getPoint(1);
      expect(p.length()).toBeGreaterThan(0);
    });

    it("all sampled points lie approximately on the sphere surface", () => {
      const radius = 1.5;
      const curve = new PathCurve(points, radius);
      const samples = [0, 0.25, 0.5, 0.75, 1];
      for (const t of samples) {
        const p = curve.getPoint(t);
        expect(p.length()).toBeCloseTo(radius, 1);
      }
    });

    it("with only 2 points, falls back to surface points", () => {
      const curve = new PathCurve([LONDON, PARIS], 1);
      const p = curve.getPoint(0);
      expect(p.length()).toBeCloseTo(1, 4);
    });

    it("uses the optionalTarget parameter to avoid allocation", () => {
      const curve = new PathCurve(points, 1);
      const target = new THREE.Vector3();
      const result = curve.getPoint(0.5, target);
      expect(result).toBe(target);
    });
  });

  describe("smoothness", () => {
    it("different smoothness values produce different midpoints", () => {
      const pts = [LONDON, PARIS, BERLIN, MADRID];
      const c1 = new PathCurve(pts, 1, 0.1);
      const c2 = new PathCurve(pts, 1, 0.9);
      const p1 = c1.getPoint(0.5);
      const p2 = c2.getPoint(0.5);
      // Not identical
      expect(p1.distanceTo(p2)).toBeGreaterThan(0);
    });
  });
});
