"use client";

import airRoutesJson from "@/data/routes/air.json";
import { GlobeRouteAnimation } from "@/lib/types";
import { RotatingGlobe } from "@/components/rotating-globe";
import { DemoCanvas } from "@/components/demos/demo-canvas";

const airRoutes = airRoutesJson as GlobeRouteAnimation[];

export default function GlobeWithArcs() {
  return (
    <DemoCanvas>
      <RotatingGlobe routes={[airRoutes]} />
    </DemoCanvas>
  );
}
