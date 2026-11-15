import area from "@turf/area";
import bbox from "@turf/bbox";
import centroid from "@turf/centroid";

export type GeoPosition = [longitude: number, latitude: number];
export type LeafletPosition = [latitude: number, longitude: number];

export type PolygonFeature = {
  type: "Feature";
  properties: Record<string, never>;
  geometry: {
    type: "Polygon";
    coordinates: GeoPosition[][];
  };
};

export type TerrainGeometry = {
  point: GeoPosition | null;
  polygon: PolygonFeature | null;
  areaSquareMeters: number | null;
  areaHectares: number | null;
  areaSquareKilometers: number | null;
};

export function toGeoPosition([latitude, longitude]: LeafletPosition): GeoPosition {
  return [longitude, latitude];
}

export function toLeafletPosition([longitude, latitude]: GeoPosition): LeafletPosition {
  return [latitude, longitude];
}

export function createPolygonFeature(positions: GeoPosition[]): PolygonFeature | null {
  if (positions.length < 3) return null;

  const firstPosition = positions[0];
  const lastPosition = positions[positions.length - 1];
  const isClosed = firstPosition[0] === lastPosition[0] && firstPosition[1] === lastPosition[1];
  const ring = isClosed ? positions : [...positions, firstPosition];

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
  };
}

export function measurePolygon(polygon: PolygonFeature) {
  const squareMeters = area(polygon);
  const bounds = bbox(polygon);
  const center = centroid(polygon).geometry.coordinates as GeoPosition;

  return {
    point: center,
    bounds,
    areaSquareMeters: squareMeters,
    areaHectares: squareMeters / 10_000,
    areaSquareKilometers: squareMeters / 1_000_000,
  };
}
