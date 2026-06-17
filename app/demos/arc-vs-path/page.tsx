"use client";

import { OrbitControls } from "@react-three/drei";

import { DemoCanvas } from "@/components/demos/demo-canvas";
import { SceneLights } from "@/components/demos/scene-lights";
import { Globe } from "@/components/globe";
import { GLOBE_DEFAULTS } from "@/lib/config";
import { GlobeRouteAnimation } from "@/lib/types";

const LONDON: [number, number] = [51.20161505986184, 1.6561925738764955];
const JEDDAH: [number, number] = [21.517503005699666, 39.16669896268115];

// Exact waypoints from ocean.json route id 2
const LONDON_TO_JEDDAH_SURFACE: [number, number][] = [
  [51.20161505986184, 1.6561925738764955],
  [50.246102673659976, 0.20511333596851955],
  [49.78281701397614, -3.018060784473505],
  [48.30439179799632, -6.958760504754395],
  [44.062297806955286, -10.70001774215487],
  [40.40296476879777, -12.233862106148905],
  [36.45224522069245, -10.672454318565599],
  [36.034116087234665, -7.762633379799183],
  [35.97332900197378, -4.5756607315101405],
  [36.11386084280973, -1.5338380012659911],
  [37.38015906376371, 1.956362349736679],
  [38.00253472543122, 6.912478351272341],
  [37.84385597496106, 11.049008351591226],
  [37.247181874719914, 12.773688733315936],
  [35.591420443820695, 16.580300717098538],
  [34.487081495586, 19.912827086760444],
  [34.03642137257627, 23.61464090307524],
  [32.95906777391828, 27.109363426359494],
  [32.247463010908234, 31.172010023080134],
  [31.412983433363237, 32.60535276188904],
  [29.488873041669606, 32.80765108185784],
  [27.594526393361605, 34.06735805973554],
  [24.887364361994614, 36.182325995070016],
  [22.278307782111, 37.568126580738436],
  [21.517503005699666, 39.16669896268115],
];

const routes: GlobeRouteAnimation[] = [
  {
    id: 1,
    type: "arc",
    path: [LONDON, JEDDAH],
    delay: 0,
    duration: 7000,
    color: GLOBE_DEFAULTS.arcColor,
  },
  {
    id: 2,
    type: "path",
    path: LONDON_TO_JEDDAH_SURFACE,
    delay: 0,
    duration: 7000,
    color: GLOBE_DEFAULTS.pathColor,
  },
];

// lon=-90° faces the camera at rotation.y=0.
// Decreasing rotation.y clockwise brings higher longitudes into view.
// London/Jeddah midpoint ≈ 20°E → offset of 110° = 1.92 rad.
const INITIAL_Y = -1.92;

export default function ArcVsPath() {
  return (
    <DemoCanvas>
      <SceneLights />
      <Globe
        position={[0, 0, 0]}
        routes={[routes]}
        rotation={[GLOBE_DEFAULTS.tilt, INITIAL_Y, 0]}
      />
      <OrbitControls enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
    </DemoCanvas>
  );
}
