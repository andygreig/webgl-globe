import * as THREE from "three";
import { latLongToVector3 } from "@/lib/utils/map";

export class PathCurve extends THREE.Curve<THREE.Vector3> {
  private surfacePoints: THREE.Vector3[];
  private interpolatedPoints: THREE.Vector3[];

  constructor(points: number[][], radius: number, smoothness: number = 0.3) {
    super();

    // Project all points directly onto sphere surface
    this.surfacePoints = points.map(([lat, lon]) =>
      latLongToVector3(lat, lon, radius)
    );

    // Generate interpolated points using Catmull-Rom spline
    this.interpolatedPoints = this.createSmoothPath(smoothness);
  }

  private createSmoothPath(smoothness: number): THREE.Vector3[] {
    // If less than 4 points, return original points
    if (this.surfacePoints.length < 4) return this.surfacePoints;

    const interpolatedPoints: THREE.Vector3[] = [];
    const tension = smoothness; // Controls curve tightness

    // Add extra points at start and end to create smooth beginning/end
    const extendedPoints = [
      this.surfacePoints[0],
      ...this.surfacePoints,
      this.surfacePoints[this.surfacePoints.length - 1],
    ];

    // Generate interpolated points
    for (let i = 1; i < extendedPoints.length - 2; i++) {
      for (let t = 0; t <= 1; t += 0.1) {
        // Catmull-Rom spline interpolation
        const point = this.catmullRomInterpolate(
          extendedPoints[i - 1],
          extendedPoints[i],
          extendedPoints[i + 1],
          extendedPoints[i + 2],
          t,
          tension
        );

        // Normalize to maintain sphere surface
        interpolatedPoints.push(
          point.normalize().multiplyScalar(this.surfacePoints[0].length())
        );
      }
    }

    return interpolatedPoints;
  }

  // Catmull-Rom spline interpolation
  private catmullRomInterpolate(
    p0: THREE.Vector3,
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3,
    t: number,
    tension: number
  ): THREE.Vector3 {
    const v0 = p2.clone().sub(p0).multiplyScalar(tension);
    const v1 = p3.clone().sub(p1).multiplyScalar(tension);

    const t2 = t * t;
    const t3 = t2 * t;

    const c0 = 2 * t3 - 3 * t2 + 1;
    const c1 = t3 - 2 * t2 + t;
    const c2 = -2 * t3 + 3 * t2;
    const c3 = t3 - t2;

    return p1
      .clone()
      .multiplyScalar(c0)
      .add(v0.clone().multiplyScalar(c1))
      .add(p2.clone().multiplyScalar(c2))
      .add(v1.clone().multiplyScalar(c3));
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    // Interpolate between generated points
    const index = Math.floor(t * (this.interpolatedPoints.length - 1));
    const nextIndex = Math.min(index + 1, this.interpolatedPoints.length - 1);
    const localT = (t * (this.interpolatedPoints.length - 1)) % 1;

    // Instead of creating a new Vector3, modify the optionalTarget
    return optionalTarget
      .copy(this.interpolatedPoints[index])
      .lerp(this.interpolatedPoints[nextIndex], localT);
  }
}
