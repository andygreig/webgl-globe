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
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [animationStartTime, setAnimationStartTime] = useState<number>(0);
  const activeAnimationsRef = useRef<number[]>([]);

  const TOTAL_CYCLE_DURATION =
    routes[routes.length - 1].delay + routes[routes.length - 1].duration + 1000;

  useEffect(() => {
    setAnimationStartTime(Date.now());
  }, []);

  useFrame(() => {
    const elapsedTime = Date.now() - animationStartTime;

    if (elapsedTime >= TOTAL_CYCLE_DURATION) {
      setAnimationStartTime(Date.now());
      activeAnimationsRef.current = [];
      setActiveAnimations([]);
      return;
    }

    const next = routes
      .filter(
        (route) =>
          elapsedTime >= route.delay &&
          elapsedTime < route.delay + route.duration
      )
      .map((route) => route.id);

    const prev = activeAnimationsRef.current;
    const changed =
      next.length !== prev.length || next.some((id, i) => id !== prev[i]);

    if (changed) {
      activeAnimationsRef.current = next;
      setActiveAnimations(next);
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
