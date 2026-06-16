export interface HTMLImageElementWithNeedsUpdate extends HTMLImageElement {
  needsUpdate?: boolean;
}

export interface DotLatLon {
  [lat: number]: number[];
}

export interface GlobeRouteAnimation {
  id: number;
  type: 'arc' | 'path';
  path: [number, number][];
  delay: number;
  duration: number;
  label?: string;
  color?: string;
  pathWidth?: number;
}

export interface AnimatedPath {
  radius: number;
  pathWidth?: number;
  pathColor?: string;
  revealDuration?: number;
  hideDuration?: number;
  pauseDuration?: number;
  markerSize?: number;
  markerColor?: string;
  markerOffset?: number;
}
