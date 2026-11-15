"use client";

import { useEffect, useRef } from "react";
import * as L from "leaflet";
import type { GeoPosition, PolygonFeature } from "@/lib/geo";
import { toGeoPosition, toLeafletPosition } from "@/lib/geo";

const initialMapCenter: GeoPosition = [15.74, -12.78];

const attribution =
  '<a href="https://cloudless.eox.at" target="_blank" rel="noreferrer">EOxCloudless</a> (<a href="https://cloudless.eox.at" target="_blank" rel="noreferrer">https://cloudless.eox.at</a>) by <a href="https://eox.at" target="_blank" rel="noreferrer">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2025) · <a href="https://cloudless.eox.at/license-non-commercial" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>';

type MapViewProps = {
  point: GeoPosition | null;
  polygon: PolygonFeature | null;
  draftPositions: GeoPosition[];
  drawing: boolean;
  cameraCenter: GeoPosition | null;
  onMapSelect: (position: GeoPosition) => void;
};

export function MapView({
  point,
  polygon,
  draftPositions,
  drawing,
  cameraCenter,
  onMapSelect,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const selectionLayerRef = useRef<L.LayerGroup | null>(null);
  const onMapSelectRef = useRef(onMapSelect);

  useEffect(() => {
    onMapSelectRef.current = onMapSelect;
  }, [onMapSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: toLeafletPosition(initialMapCenter),
      zoom: 5,
      minZoom: 2,
      maxZoom: 14,
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer(
      "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg",
      { attribution, minZoom: 0, maxZoom: 14 },
    ).addTo(map);

    const handleClick = (event: L.LeafletMouseEvent) => {
      onMapSelectRef.current(toGeoPosition([event.latlng.lat, event.latlng.lng]));
    };
    map.on("click", handleClick);

    const frame = window.requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.cancelAnimationFrame(frame);
      map.off("click", handleClick);
      if (selectionLayerRef.current) {
        map.removeLayer(selectionLayerRef.current);
        selectionLayerRef.current = null;
      }
      map.remove();
      if (mapRef.current === map) mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map && cameraCenter) {
      map.flyTo(toLeafletPosition(cameraCenter), map.getZoom(), { duration: 0.6 });
    }
  }, [cameraCenter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectionLayerRef.current) {
      map.removeLayer(selectionLayerRef.current);
      selectionLayerRef.current = null;
    }
    const selectionLayer = L.layerGroup().addTo(map);
    selectionLayerRef.current = selectionLayer;

    if (polygon) {
      L.polygon(polygon.geometry.coordinates[0].map(toLeafletPosition), {
        color: "#d79a5b",
        fillColor: "#d79a5b",
        fillOpacity: 0.22,
        weight: 3,
      }).addTo(selectionLayer);
    } else if (draftPositions.length > 0) {
      const positions = draftPositions.map(toLeafletPosition);
      if (positions.length > 1) {
        L.polyline(positions, { color: "#d79a5b", dashArray: "7 7", weight: 3, interactive: false }).addTo(selectionLayer);
      }
      positions.forEach((position, index) => {
        L.circleMarker(position, {
          radius: index === 0 ? 7 : 5,
          color: "#fff",
          fillColor: "#8b5e3c",
          fillOpacity: 1,
          weight: 2,
          interactive: false,
        }).addTo(selectionLayer);
      });
    } else if (point) {
      L.circleMarker(toLeafletPosition(point), {
        radius: 9,
        color: "#fff",
        fillColor: "#26422d",
        fillOpacity: 1,
        weight: 3,
        interactive: false,
      }).addTo(selectionLayer);
    }

  }, [point, polygon, draftPositions]);

  return (
    <div
      className={`relative h-full min-h-90 w-full bg-[#dce5d8] ${
        drawing
          ? "cursor-crosshair [&_.leaflet-container]:!cursor-crosshair [&_.leaflet-grab]:!cursor-crosshair [&_.leaflet-interactive]:!cursor-crosshair"
          : ""
      }`}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
