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
import { on } from "events";

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

    for (const [key, value] of Object.entries(geoJsons)) {
      map.current.addSource(value, key);
      map.current.onPolygonClick(key, onPolygonClick);
    }
  }, [onPolygonClick]);

  return (
    <Container style={{ height: "100%", width: "100%" }} id="map"></Container>
  );
};

export default Map;
