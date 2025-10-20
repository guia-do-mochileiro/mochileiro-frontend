import type { LngLatLike } from "mapbox-gl";
import type { Bound } from "../constants/northRegion";

export type BoundPair = [LngLatLike, LngLatLike];

export function toPair(b: Bound): BoundPair {
  return [
    { lng: b[0][0], lat: b[0][1] },
    { lng: b[1][0], lat: b[1][1] },
  ];
}

export function expand(b: Bound, dx: number, dy: number): Bound {
  return [
    [b[0][0] - dx, b[0][1] - dy],
    [b[1][0] + dx, b[1][1] + dy],
  ] as Bound;
}
