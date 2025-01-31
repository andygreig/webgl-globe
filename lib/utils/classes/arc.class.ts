import * as THREE from "three";

import { interpolateArc, latLongToVector3 } from "@/lib/utils/map";

// ArcCurve Class
export class ArcCurve extends THREE.Curve<THREE.Vector3> {
  private startPoint: THREE.Vector3;
  private endPoint: THREE.Vector3;
  private control1: THREE.Vector3;
  private control2: THREE.Vector3;

  constructor(
    start: [number, number],
    end: [number, number],
    radius: number,
    arcHeightFactor: number,
    arcHeightOffset: number
  ) {
    super();

    const [startLat, startLon] = start;
    const [endLat, endLon] = end;

    this.startPoint = latLongToVector3(startLat, startLon, radius);
    this.endPoint = latLongToVector3(endLat, endLon, radius);

    // Calculate arc height based on distance between points
    const distance = this.startPoint.distanceTo(this.endPoint);
    const arcHeight = distance * arcHeightFactor + radius + arcHeightOffset;

    // Calculate control points
    this.control1 = interpolateArc(this.startPoint, this.endPoint, 0.3);
    this.control2 = interpolateArc(this.startPoint, this.endPoint, 0.7);

    // Lift control points to create arc
    this.control1.setLength(arcHeight);
    this.control2.setLength(arcHeight);
  }

  getPoint(t: number): THREE.Vector3 {
    const curve = new THREE.CubicBezierCurve3(
      this.startPoint,
      this.control1,
      this.control2,
      this.endPoint
    );
    return curve.getPoint(t);
  }
}
