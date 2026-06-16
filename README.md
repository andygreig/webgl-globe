# 3D Animated Globe

An interactive 3D globe built with React Three Fiber and Next.js. It renders land masses as twinkling dots and animates trade routes as arcs and paths between cities around the world.

<video src="https://github.com/user-attachments/assets/aa4e0dff-ff2c-490e-ad71-8de55f0f0cd1" autoplay loop muted playsinline width="100%"></video>

## Demo
[https://globe-andy-greig.vercel.app/](https://globe-andy-greig.vercel.app/)

## Features

- **Dot-rendered land masses** — land areas are drawn as thousands of individually twinkling point instances, derived from a world map image
- **Animated arcs** — great-circle arcs between cities, with animated reveal/hide using draw range on tube geometry
- **Animated paths** — multi-waypoint ocean/shipping routes rendered as Catmull-Rom splines on the sphere surface
- **Target markers** — origin and destination markers appear as the routes animate
- **Orbit controls** — drag to rotate, scroll to zoom
- **Auto-rotation** — the globe slowly rotates, interruptible by the user

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) — helpers (OrbitControls)
- [Three.js](https://threejs.org/)
- TypeScript + Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3008](http://localhost:3008).

## Project Structure

```
app/
  page.tsx          — entry point, renders <Scene>
  layout.tsx        — root layout and metadata
  globals.css       — background colour

components/
  scene/            — Canvas setup and leva controls panel
    index.tsx       — R3F Canvas with camera config

  rotating-globe/   — auto-rotation + lighting + OrbitControls
  globe/            — main globe composition
    index.tsx       — sphere mesh + dots + animation groups
    animation-group/ — timing loop that activates routes on delay
    arc/            — animated great-circle arc (reveal → pause → hide)
    path/           — animated multi-waypoint path (Catmull-Rom spline)
    dots/           — instanced twinkling land-mass dots (custom shader)
    target-marker/  — origin/destination ring marker

data/
  routes/
    air.json        — arc routes (flight paths)
    ocean.json      — path routes (shipping lanes)

lib/
  types/            — shared TypeScript interfaces
  utils/
    map.ts          — lat/lon ↔ 3D conversion, land visibility check
    load-image.ts   — loads an image into ImageData via canvas
    classes/
      arc.class.ts  — CubicBezier curve for arcs
      path.class.ts — Catmull-Rom spline curve for paths

public/
  world_alpha_mini.jpg — low-res world map used to detect land pixels
```

## Adding Routes

Routes are plain JSON arrays in `data/routes/air.json` (arcs) and `data/routes/ocean.json` (paths). Each entry follows `GlobeRouteAnimation`:

```ts
interface GlobeRouteAnimation {
  id: number;       // unique within the animation group
  type: "arc" | "path";
  path: [number, number][]; // [lat, lon] pairs — two for arc, many for path
  delay: number;    // ms before this route starts animating
  duration: number; // ms for the full reveal + pause + hide cycle
}
```

**Arc example** (two points, flies above the surface):
```ts
{
  id: 1,
  type: "arc",
  path: [
    [40.7128, -74.006],   // New York
    [48.8566,   2.3522],  // Paris
  ],
  delay: 0,
  duration: 3500,
}
```

**Path example** (many waypoints, hugs the sphere surface):
```ts
{
  id: 1,
  type: "path",
  path: [
    [29.4, -94.5],  // Houston
    [28.8, -89.4],
    // ... intermediate waypoints ...
    [53.5,   9.9],  // Hamburg
  ],
  delay: 0,
  duration: 6500,
}
```

Multiple independent animation groups can run in parallel — pass them as separate arrays to `RotatingGlobe`:

```tsx
<RotatingGlobe routes={[airRoutes, oceanRoutes]} rotationSpeed={0.0012} />
```

Each group cycles independently through its own timing sequence.

## Customisation

All defaults live in [`lib/config.ts`](lib/config.ts) — that's the single file to edit when customising the globe's look and feel. They are also exposed as props and tweakable live via the built-in controls panel.

| Prop | Component | Default | Effect |
|------|-----------|---------|--------|
| `rotationSpeed` | `RotatingGlobe` | `0.0012` | Globe auto-rotation speed |
| `paused` | `RotatingGlobe` | `false` | Pause auto-rotation |
| `sphereSize` | `Globe` | `19` | Radius of the sphere |
| `sphereColor` | `Globe` | `#0b2636` | Globe sphere colour |
| `dotDensity` | `Globe` | `3` | Dot density per degree of latitude |
| `dotColor` | `Globe` | `#519fcd` | Land dot colour |
| `twinkleStrength` | `Globe` | `0.7` | Twinkle animation intensity |
| `tilt` | `Globe` | `0.3` | Axial tilt in radians |
| `arcColor` | `Globe` | `#84b845` | Default arc route colour |
| `pathColor` | `Globe` | `#2196f3` | Default path route colour |
| `animationSpeed` | `Globe` | `1` | Global animation speed multiplier |
| `arcHeightFactor` | `Arc` | `0.3` | How high arcs fly above the surface |
| `pathWidth` | `Arc` / `Path` | `0.03` | Tube radius |

## How Land Detection Works

On mount, `Dots` loads `public/world_alpha_mini.jpg` onto an off-screen canvas, reads the pixel data, and records which longitude values are dark (land) for each latitude row. When generating dot positions, it uses a binary search on those recorded values to skip ocean coordinates — so only land-mass dots are rendered.

## License

MIT
