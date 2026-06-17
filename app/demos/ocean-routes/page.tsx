"use client";

import oceanRoutesJson from "@/data/routes/ocean.json";
import { GlobeRouteAnimation } from "@/lib/types";
import { RotatingGlobe } from "@/components/rotating-globe";
import { DemoCanvas } from "@/components/demos/demo-canvas";

const oceanRoutes = oceanRoutesJson as GlobeRouteAnimation[];

export default function OceanRoutes() {
  return (
    <DemoCanvas>
      <RotatingGlobe routes={[oceanRoutes]} />
    </DemoCanvas>
  );
}
