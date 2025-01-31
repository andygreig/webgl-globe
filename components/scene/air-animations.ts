import { GlobeRouteAnimation } from "@/lib/types";

export const routes: GlobeRouteAnimation[] = [
  {
    id: 1,
    type: "arc",
    path: [
      [40.7128, -74.006], // New York
      [48.8566, 2.3522], // Paris
    ],
    delay: 0,
    duration: 3500,
  },
  {
    id: 2,
    type: "arc",
    path: [
      [34.0522, -118.2437], // Los Angeles
      [40.7128, -74.006], // New York
    ],
    delay: 3500,
    duration: 3000,
  },
  {
    id: 3,
    type: "arc",
    path: [
      [40.7128, -74.006], // New York
      [-34.603722, -58.381592], // Buenos Aires
    ],
    delay: 8500,
    duration: 3000,
  },
  {
    id: 4,
    type: "arc",
    path: [
      [48.8566, 2.3522], // Paris
      [6.5244, -3.379], // Lagos
    ],
    delay: 4000,
    duration: 2500,
  },
  {
    id: 5,
    type: "arc",
    path: [
      [25.2048, 55.2708], // Dubai
      [19.076, 72.8777], // Mumbai
    ],
    delay: 6500,
    duration: 2000,
  },
  {
    id: 6,
    type: "arc",
    path: [
      [35.6762, 139.6503], // Tokyo
      [34.0522, -118.2437], // Los Angeles
    ],
    delay: 8500,
    duration: 2000,
  },
  {
    id: 7,
    type: "arc",
    path: [
      [34.0522, -118.2437], // Los Angeles
      [35.6762, 139.6503], // Tokyo
    ],
    delay: 1500,
    duration: 4000,
  },
  {
    id: 8,
    type: "arc",
    path: [
      [6.5244, -3.379], // Lagos
      [25.2048, 55.2708], // Dubai
    ],
    delay: 10500,
    duration: 2500,
  },
  {
    id: 9,
    type: "arc",
    path: [
      [31.2304, 121.4737], // Shanghai
      [35.6762, 139.6503], // Tokyo
    ],
    delay: 13000,
    duration: 1500,
  },
  {
    id: 10,
    type: "arc",
    path: [
      [19.076, 72.8777], // Mumbai
      [1.3521, 103.8198], // Singapore
    ],
    delay: 14500,
    duration: 3500,
  },
  {
    id: 101,
    type: "arc",
    path: [
      [-37.8409, 144.9464], // Melbourne
      [22.3027, 114.1772], // Hong Kong
    ],
    delay: 9500,
    duration: 3500,
  },
  {
    id: 11,
    type: "arc",
    path: [
      [1.3521, 103.8198], // Singapore
      [31.2304, 121.4737], // Shanghai
    ],
    delay: 18000,
    duration: 2500,
  },
];
