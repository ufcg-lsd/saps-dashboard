import { Container } from "./style";
import { useEffect, useRef } from "react";
import { Map as MapObject } from "@src/services/map";
// @ts-ignore
import asiaGeoJson from "public/asia.geojson";
// @ts-ignore
import northAmericaGeoJson from "public/northAmerica.geojson";
// @ts-ignore
import southAmericaGeoJson from "public/southAmerica.geojson";
// @ts-ignore
import eurAfricaGeoJson from "public/eurAfrica.geojson";
// @ts-ignore
import oceaniaGeoJson from "public/oceania.geojson";
import { Area } from "@pages/data";
import { getHeatMap } from "@src/services/heatmap";
import { getHeatMapInterval, getHeatMapOpacity } from "@src/utils/heatmap";

const geoJsons = {
  asia: asiaGeoJson,
  northAmerica: northAmericaGeoJson,
  southAmerica: southAmericaGeoJson,
  eurAfrica: eurAfricaGeoJson,
  oceania: oceaniaGeoJson,
};

interface PropsTypes {
  onPolygonClick: (area: Area) => void;
}

const Map = (props: PropsTypes) => {
  const { onPolygonClick } = props;

  const map = useRef<MapObject | null>(null);

  useEffect(() => {
    if (map.current) return;

    const mapApiKey: string = process.env.NEXT_PUBLIC_MAP_API_KEY || "";
    map.current = new MapObject(mapApiKey, {
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-35.89, -7.24],
      zoom: 6,
      projection: "globe",
    });

    const joinedGeoJsons = Object.values(geoJsons).reduce((acc, curr) => {
      if (!acc.type) {
        acc = curr;
        return acc;
      }

      return {
        ...acc,
        features: [...acc.features, ...curr.features],
      };
    }, {});

    joinedGeoJsons.features.sort((a: any, b: any) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;

      return 0;
    });

    const opacityMapping: Record<string, number> = {};

    getHeatMap().then((data: Record<string, number>) => {
      const interval = getHeatMapInterval(data);

      Object.entries(data).forEach(([key, value]) => {
        const opacity = getHeatMapOpacity(interval, value);
        opacityMapping[key] = Number(opacity.toFixed(3));
      });

      joinedGeoJsons.features.forEach((feature: any) => {
        const opacity = opacityMapping[feature.id] || 0;
        feature.properties = { ...feature.properties, opacity };
      });

      map?.current?.addSource(joinedGeoJsons, "joined");
      map?.current?.onPolygonClick("joined", onPolygonClick);
    });
  }, [onPolygonClick]);

  return (
    <Container style={{ height: "100%", width: "100%" }} id="map"></Container>
  );
};

export default Map;
