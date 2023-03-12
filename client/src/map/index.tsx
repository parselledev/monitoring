import { load } from "@2gis/mapgl";
import { memo, useEffect } from "react";
import { useUnit } from "effector-react/compat";
import { $currentTrack } from "../controls/model";

export const Map = () => {
  const [currentTrack] = useUnit([$currentTrack]);

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
    console.log("test");
    load().then((mapgl) => {
      map = new mapgl.Map("map-container", {
        center: [20.522829, 54.71246],
        zoom: 15,
        key: "6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb",
      });

      createRoute(mapgl, map);
    });

    // Удаляем карту при размонтировании компонента
    return () => map && map.destroy();
  }, [currentTrack]);

  return <div id="map-container" style={{ width: "100%", height: "95vh" }} />;
};
