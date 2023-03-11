import { load } from "@2gis/mapgl";
import { memo, useEffect } from "react";

const segments = [
  {
    color: "#e84646",
    label: "A",
    coords: [
      [20.537042, 54.711877],
      [20.537693, 54.709871],
      [20.549342, 54.709811],
    ],
  },
  {
    color: "#43e843",
    label: "B",
    coords: [[20.549342, 54.709811]],
  },
];

export const Map = () => {
  useEffect(() => {
    let map: any = null;
    console.log("test");
    load().then((mapgl) => {
      map = new mapgl.Map("map-container", {
        center: [20.522829, 54.71246],
        zoom: 15,
        key: "6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb",
      });
      segments.forEach((segment, i) => {
        const zIndex = segments.length - 1 - i;
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
    });

    // Удаляем карту при размонтировании компонента
    return () => map && map.destroy();
  }, []);

  return <div id="map-container" style={{ width: "100%", height: "100vh" }} />;
};
