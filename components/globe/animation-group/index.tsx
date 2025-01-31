import { GlobeRouteAnimation } from "@/lib/types";
import { Arc } from "../arc";
import { useEffect, useRef, useState } from "react";
import { Path } from "../path";
import { useFrame } from "@react-three/fiber";

interface AnimationGroupProps {
  sphereSize: number;
  routes: GlobeRouteAnimation[];
}

const AnimationGroup = ({ routes, sphereSize }: AnimationGroupProps) => {
  // State to control animation sequence
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [animationStartTime, setAnimationStartTime] = useState<number>(0);
  const animationCycleRef = useRef<number>(0);

  // Calculate total animation cycle duration
  const TOTAL_CYCLE_DURATION =
    routes[routes.length - 1].delay + routes[routes.length - 1].duration + 1000; // Additional buffer time

  // Animation loop and sequencing
  useEffect(() => {
    // Start the initial animation sequence
    const startTime = Date.now();
    setAnimationStartTime(startTime);

    // Return cleanup function
    return () => {
      cancelAnimationFrame(animationCycleRef.current);
    };
  }, []);

  // Use useFrame for precise animation timing
  useFrame(() => {
    // Calculate elapsed time since animation start
    const elapsedTime = Date.now() - animationStartTime;

    // Reset or progress animation cycle
    if (elapsedTime >= TOTAL_CYCLE_DURATION) {
      // Reset animation start time
      setAnimationStartTime(Date.now());
      // Clear active animations
      setActiveAnimations([]);
    }

    // Determine active animations based on elapsed time
    const currentActiveAnimations = routes
      .filter(
        (route) =>
          elapsedTime >= route.delay &&
          elapsedTime < route.delay + route.duration
      )
      .map((route) => route.id);

    // Update active animations if changed
    if (
      JSON.stringify(currentActiveAnimations) !==
      JSON.stringify(activeAnimations)
    ) {
      setActiveAnimations(currentActiveAnimations);
    }
  });

  return routes.map((route) => {
    if (!activeAnimations.includes(route.id)) return null;
    const pauseDuration = 500;
    const durationMinusDelay = route.duration - pauseDuration;
    const pathDuration = durationMinusDelay / 2;

    if (route.type === "arc") {
      const [start, end] = route.path;
      return (
        <Arc
          key={route.id}
          start={start}
          end={end}
          radius={sphereSize}
          revealDuration={pathDuration}
          hideDuration={pathDuration}
          pauseDuration={pauseDuration}
        />
      );
    }
    if (route.type === "path") {
      return (
        <Path
          key={route.id}
          points={route.path}
          smoothness={0.3} // Adjust smoothness (0-1)
          radius={sphereSize}
          revealDuration={pathDuration}
          hideDuration={pathDuration}
          pauseDuration={pauseDuration}
        />
      );
    }
  });
};

export { AnimationGroup };
