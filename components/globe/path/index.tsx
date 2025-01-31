import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PathCurve } from "@/lib/utils/classes/path.class";
import { TargetMarker } from "../target-marker";
import { latLongToVector3 } from "@/lib/utils/map";
import { AnimatedPath } from "@/lib/types";

interface PathProps extends AnimatedPath {
  points: number[][]; // Array of [lat, lon] coordinates
  smoothness?: number;
  pathColor?: number;
  pathWidth?: number;
}

const Path = ({
  points,
  radius = 20,
  smoothness = 0.3,
  pathColor = 0x2196f3,
  pathWidth = 0.03,
  revealDuration = 2500,
  hideDuration = 2500,
  pauseDuration = 500,
  markerSize = 0.2,
  markerColor = 0x125291,
  markerOffset = -0.1,
}: PathProps) => {
  // Ref for tube geometry
  const tubeRef = useRef<THREE.BufferGeometry>(null);
  const startTime = useRef<number | null>(null);

  // State to manage animation stages
  const [animationStage, setAnimationStage] = useState<
    "reveal" | "pause" | "hide"
  >("reveal");

  const directedPoints = animationStage === "hide" ? points.reverse() : points;

  const startPostition = points[0];
  const endPostition = points[points.length - 1];
  const startMarkerPosition = latLongToVector3(
    startPostition[0],
    startPostition[1],
    radius
  );
  const endMarkerPosition = latLongToVector3(
    endPostition[0],
    endPostition[1],
    radius
  );

  const pathCurve = useMemo(() => {
    return new PathCurve(directedPoints, radius, smoothness);
  }, [directedPoints, radius, smoothness, animationStage]);

  useFrame(({ clock }) => {
    if (!startTime.current) {
      startTime.current = clock.getElapsedTime();
    }
    const elapsedTime = clock.getElapsedTime() - startTime.current;

    if (tubeRef.current) {
      // Total number of segments in the tube geometry
      const segmentCount = tubeRef.current.index?.count || 0;

      switch (animationStage) {
        case "reveal":
          const revealProgress = Math.min(
            elapsedTime / (revealDuration / 1000),
            1
          );
          const visibleRevealSegments = Math.floor(
            segmentCount * revealProgress
          );
          tubeRef.current.setDrawRange(0, visibleRevealSegments);

          if (revealProgress >= 1) {
            startTime.current = clock.getElapsedTime();
            setAnimationStage("pause");
          }
          break;

        case "pause":
          // Maintain full visibility during pause
          tubeRef.current.setDrawRange(0, segmentCount);

          if (elapsedTime >= pauseDuration / 1000) {
            startTime.current = clock.getElapsedTime();
            setAnimationStage("hide");
          }
          break;

        case "hide":
          const hideProgress = Math.min(elapsedTime / (hideDuration / 1000), 1);
          const visibleHideSegments = Math.floor(
            segmentCount * (1 - hideProgress)
          );

          // Gradually reduce the visible segments from the start
          tubeRef.current.setDrawRange(0, visibleHideSegments);
          break;
      }
    }
  });

  return (
    <>
      <mesh>
        <tubeGeometry
          ref={tubeRef}
          args={[
            pathCurve,
            points.length * 10, // increased point density
            pathWidth,
            4, // radial segments
            false, // not closed
          ]}
        />
        <meshStandardMaterial color={pathColor} side={THREE.DoubleSide} />
      </mesh>
      <TargetMarker
        position={startMarkerPosition}
        size={markerSize}
        offset={markerOffset}
        color={markerColor}
        visible={animationStage !== "hide"}
      />
      <TargetMarker
        position={endMarkerPosition}
        size={markerSize}
        offset={markerOffset}
        color={markerColor}
        visible={animationStage === "pause" || animationStage === "hide"}
      />
    </>
  );
};

export { Path };
