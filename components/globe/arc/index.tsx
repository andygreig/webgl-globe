import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";

import { ArcCurve } from "@/lib/utils/classes/arc.class";
import { latLongToVector3 } from "@/lib/utils/map";

import { TargetMarker } from "../target-marker";
import { AnimatedPath } from "@/lib/types";
import { GLOBE_DEFAULTS } from "@/lib/config";

interface ArcProps extends AnimatedPath {
  start: [number, number];
  end: [number, number];
  arcHeightFactor?: number;
  arcHeightOffset?: number;
}

const Arc = ({
  start,
  end,
  radius = 20,
  arcHeightFactor = 0.3,
  arcHeightOffset = 0,
  pathWidth = 0.03,
  pathColor = GLOBE_DEFAULTS.arcColor,
  revealDuration = 2500,
  hideDuration = 2500,
  pauseDuration = 500,
  markerSize = 0.2,
  markerColor = GLOBE_DEFAULTS.markerColor,
  markerOffset = -0.1,
}: ArcProps) => {
  const tubeRef = useRef<THREE.BufferGeometry | null>(null);
  const startTime = useRef<number | null>(null);

  // State to manage animation stages
  const [animationStage, setAnimationStage] = useState<
    "reveal" | "pause" | "hide"
  >("reveal");

  const arcPath = animationStage === "hide" ? [end, start] : [start, end];
  const startMarkerPosition = latLongToVector3(start[0], start[1], radius);
  const endMarkerPosition = latLongToVector3(end[0], end[1], radius);

  const arcCurve = useMemo(() => {
    return new ArcCurve(
      arcPath[0],
      arcPath[1],
      radius,
      arcHeightFactor,
      arcHeightOffset
    );
  }, [start, end, animationStage]);

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
          args={[arcCurve, 44, pathWidth, 4, false]}
        />
        <meshStandardMaterial color={pathColor} />
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

export { Arc };
