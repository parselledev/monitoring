import { load } from "@2gis/mapgl";
import { memo, useEffect } from "react";
import { useUnit } from "effector-react/compat";
import { $currentSegment, $currentTrack } from "../controls/model";

export const Map = () => {
  const [currentTrack, currentSegment] = useUnit([
    $currentTrack,
    $currentSegment,
  ]);

  const createRoute = (mapgl: any, map: any) => {
    if (!currentTrack) return null;

    currentTrack.segments.forEach((segment: any, i: any) => {
      const zIndex = currentTrack.segments.length - 1 - i;
      new mapgl.Polyline(map, {
        coordinates: segment.coords,
        width: 10,
        color: segment.color,
        width2: 14,
        color2: "#ffffff",
        zIndex,
      });

      if (segment.label) {
        const isFirstPoint = i === 0;
        const lastPointIndex = segment.coords.length - 1;
        const coords = isFirstPoint
          ? segment.coords[0]
          : segment.coords[lastPointIndex];

        new mapgl.CircleMarker(map, {
          coordinates: coords,
          radius: 16,
          color: "#0088ff",
          strokeWidth: 2,
          strokeColor: "#ffffff",
          zIndex: isFirstPoint ? 5 : 3,
        });

        new mapgl.Label(map, {
          coordinates: coords,
          text: segment.label,
          fontSize: 14,
          color: "#ffffff",
          zIndex: isFirstPoint ? 6 : 4,
        });
      }
    });
  };

  useEffect(() => {
    let map: any = null;
    load().then((mapgl) => {
      map = new mapgl.Map("map-container", {
        center: currentSegment
          ? [currentSegment.geo.lon, currentSegment.geo.lat]
          : currentTrack?.segments[0].coords[0] || [20.522829, 54.71246],
        zoom: 15,
        key: "6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb",
      });

      if (currentSegment) {
        new mapgl.Marker(map, {
          coordinates: [currentSegment.geo.lon, currentSegment.geo.lat],
        });
      }

      createRoute(mapgl, map);
    });

    // Удаляем карту при размонтировании компонента
    return () => map && map.destroy();
  }, [currentTrack, currentSegment]);

  return <div id="map-container" style={{ width: "100%", height: "100vh" }} />;
};
