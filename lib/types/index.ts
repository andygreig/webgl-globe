export interface HTMLImageElementWithNeedsUpdate extends HTMLImageElement {
  needsUpdate?: boolean;
}

export interface DotLatLon {
  [lat: number]: number[];
}
