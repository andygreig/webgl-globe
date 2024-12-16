import * as THREE from "three";

import { interpolateArc, latLongToVector3 } from "@/lib/utils/map";

interface ArcProps {
  start: number[];
  end: number[];
  radius: number;
  duration?: number;
  arcHeightFactor?: number; // Customize arc height
  arcHeightOffset?: number; // Additional offset for fine-tuning
}

const Arc = ({
  start,
  end,
  radius = 20,
  arcHeightFactor = 0.5,
  arcHeightOffset = 0,
  duration = 2500,
}: ArcProps) => {
  const [startLat, startLon] = start;
  const [endLat, endLon] = end;

  const startPoint = latLongToVector3(startLat, startLon, radius);
  const endPoint = latLongToVector3(endLat, endLon, radius);

  // Calculate arc height based on distance between points
  const distance = startPoint.distanceTo(endPoint);
  const arcHeight = distance * arcHeightFactor + radius + arcHeightOffset;

  // Calculate control points
  const control1 = interpolateArc(startPoint, endPoint, 0.3);
  const control2 = interpolateArc(startPoint, endPoint, 0.7);

  // Lift control points to create arc
  control1.setLength(arcHeight);
  control2.setLength(arcHeight);

  const curve = new THREE.CubicBezierCurve3(
    startPoint,
    control1,
    control2,
    endPoint
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 44, 0.1, 8, false]} />
      <meshStandardMaterial color={0x3366ff} transparent opacity={0.7} />
    </mesh>
  );
};

export { Arc };
