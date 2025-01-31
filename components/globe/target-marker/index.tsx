import * as THREE from "three";
import { useMemo } from "react";

interface MarkerProps {
  position: THREE.Vector3;
  size?: number;
  offset?: number;
  color?: number;
  visible?: boolean;
}

const TargetMarker = ({
  position,
  size = 0.05,
  offset = 0.15,
  color = 0x84b845,
  visible = true,
}: MarkerProps) => {
  // Calculate quaternion for marker orientation
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();

    matrix.lookAt(new THREE.Vector3(0, 0, 0), position, up);
    quaternion.setFromRotationMatrix(matrix);

    return quaternion;
  }, [position]);

  return (
    <group position={position} quaternion={quaternion} visible={visible}>
      {/* Center dot */}
      <mesh position={[0, 0, offset]}>
        <circleGeometry args={[size * 0.3, 32]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer ring */}
      <mesh position={[0, 0, offset]}>
        <ringGeometry args={[size * 0.8, size, 32]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export { TargetMarker };
