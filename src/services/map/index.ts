import { Area } from "@pages/data";
import mapboxgl from "mapbox-gl";

type MapOptions = {
  container: string;
  style: string;
  center: [number, number];
  zoom: number;
  projection?: string;
};

export class Map {
  isLoaded: boolean = false;
  map: mapboxgl.Map;
  beforeLoadQueue: { name: "addSource"; params: any[] }[] | undefined;

  constructor(apiKey: string, options: MapOptions) {
    this.beforeLoadQueue = [];
    mapboxgl.accessToken = apiKey;
    // @ts-ignore
    this.map = new mapboxgl.Map({
      ...options,
    });
    this.init();
  }

  private init(): void {
    this.map.on("load", () => {
      this.isLoaded = true;
      this.beforeLoadQueue?.forEach((item) => {
        const { name, params } = item;
        const selectedFunction = this[name];
        type FuncParams = Parameters<typeof selectedFunction>;
        selectedFunction.apply(this, params as FuncParams);
      });
    });
  }

  public addSource(geojson: GeoJSON.GeoJSON, sourceName: string): void {
    if (!this.isLoaded) {
      this.beforeLoadQueue?.push({
        name: "addSource",
        params: [geojson, sourceName],
      });
      return;
    }

    this.map.addSource(sourceName, {
      type: "geojson",
      data: geojson,
    });

    this.map.addLayer({
      id: sourceName + "-fills",
      type: "fill",
      source: sourceName, 
      layout: {},
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#22A699",
          "#F24C3D",
        ], 
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.9,
          ["get", "opacity"],
        ],
        "fill-outline-color": "#000", 
      },
    });
    this.map.addLayer({
      id: "outline " + sourceName,
      type: "line",
      source: sourceName,
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 1,
        "line-opacity": 0.1,
      },
    });
    let hoveredPolygonId: any = null;

    this.map.on("mousemove", sourceName + "-fills", (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredPolygonId !== null) {
          this.map.setFeatureState(
            { source: sourceName, id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = e?.features[0].id;
        this.map.setFeatureState(
          { source: sourceName, id: hoveredPolygonId },
          { hover: true }
        );
      }
    });
  }

  public onPolygonClick(sourceName: string, callback: Function): void {
    this.map.on("click", sourceName + "-fills", (e) => {
      const upperRight: [number, number] = JSON.parse(
        e?.features?.[0]?.properties?.UR
      );

      const lowerLeft: [number, number] = JSON.parse(
        e?.features?.[0]?.properties?.LL
      );
      const area: Area = {
        upperRight: {
          latitude: upperRight[1],
          longitude: upperRight[0],
        },
        lowerLeft: {
          latitude: lowerLeft[1],
          longitude: lowerLeft[0],
        },
      };
      callback(area);
    });
  }
}
