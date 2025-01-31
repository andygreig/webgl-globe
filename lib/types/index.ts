export interface HTMLImageElementWithNeedsUpdate extends HTMLImageElement {
  needsUpdate?: boolean;
}

export interface DotLatLon {
  [lat: number]: number[];
}

export interface GlobeRouteAnimation {
  id: number;
  type: string;
  path: [number, number][];
  delay: number;
  duration: number;
}

export interface AnimatedPath {
  radius: number;
  pathWidth?: number;
  pathColor?: number;
  revealDuration?: number; // Animation duration for revealing
  hideDuration?: number; // Animation duration for hiding
  pauseDuration?: number; // Pause duration between reveal and hide
  markerSize?: number; // Size of the start/end marker
  markerColor?: number; // Color of the start/end marker
  markerOffset?: number; // Position offset of the marker
}
