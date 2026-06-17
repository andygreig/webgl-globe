"use client";

import { RotatingGlobe } from "@/components/rotating-globe";
import { DemoCanvas } from "@/components/demos/demo-canvas";

export default function SphereWithDots() {
  return (
    <DemoCanvas>
      <RotatingGlobe routes={[]} />
    </DemoCanvas>
  );
}
