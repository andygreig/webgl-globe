"use client";

import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";

import { RotatingGlobe } from "../rotating-globe";
import airRoutesJson from "@/data/routes/air.json";
import oceanRoutesJson from "@/data/routes/ocean.json";
import { GlobeRouteAnimation } from "@/lib/types";

const airRoutes = airRoutesJson as GlobeRouteAnimation[];
const oceanRoutes = oceanRoutesJson as GlobeRouteAnimation[];
import { GLOBE_DEFAULTS } from "@/lib/config";

const Scene = () => {
  const { rotationSpeed, paused, tilt } = useControls(
    "Globe",
    {
      rotationSpeed: {
        value: GLOBE_DEFAULTS.rotationSpeed,
        min: 0,
        max: 0.008,
        step: 0.0001,
        label: "Rotation Speed",
      },
      paused: { value: false, label: "Pause Rotation" },
      tilt: {
        value: GLOBE_DEFAULTS.tilt,
        min: 0,
        max: Math.PI / 4,
        step: 0.01,
        label: "Axial Tilt",
      },
    }
  );

  const { sphereColor } = useControls("Appearance", {
    sphereColor: { value: GLOBE_DEFAULTS.sphereColor, label: "Globe Color" },
  });

  const { dotColor, dotDensity, twinkleStrength } = useControls(
    "Dots",
    {
      dotColor: { value: GLOBE_DEFAULTS.dotColor, label: "Dot Color" },
      dotDensity: {
        value: GLOBE_DEFAULTS.dotDensity,
        min: 1,
        max: 6,
        step: 0.5,
        label: "Dot Density",
      },
      twinkleStrength: {
        value: GLOBE_DEFAULTS.twinkleStrength,
        min: 0,
        max: 1.5,
        step: 0.05,
        label: "Twinkle Strength",
      },
    }
  );

  const { arcColor, pathColor, animationSpeed } = useControls(
    "Routes",
    {
      arcColor: { value: GLOBE_DEFAULTS.arcColor, label: "Arc Color" },
      pathColor: { value: GLOBE_DEFAULTS.pathColor, label: "Path Color" },
      animationSpeed: {
        value: GLOBE_DEFAULTS.animationSpeed,
        min: 0.25,
        max: 4,
        step: 0.25,
        label: "Animation Speed",
      },
    }
  );

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
    >
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          near: 1,
          far: 500,
          zoom: 1,
          position: [0, 0, 65],
        }}
      >
        <RotatingGlobe
          routes={[airRoutes, oceanRoutes]}
          rotationSpeed={rotationSpeed}
          paused={paused}
          tilt={tilt}
          sphereColor={sphereColor}
          dotDensity={dotDensity}
          dotColor={dotColor}
          twinkleStrength={twinkleStrength}
          arcColor={arcColor}
          pathColor={pathColor}
          animationSpeed={animationSpeed}
        />
      </Canvas>
    </div>
  );
};

export { Scene };
