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

    // Add a new layer to visualize the polygon.
    this.map.addLayer({
      id: sourceName,
      type: "fill",
      source: sourceName, // reference the data source
      layout: {},
      paint: {
        "fill-color": "#0080ff", // blue color fill
        "fill-opacity": 0.1,
      },
    });
    // Add a black outline around the polygon.
    this.map.addLayer({
      id: "outline " + sourceName,
      type: "line",
      source: sourceName,
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 1,
        "line-opacity": 0.5,
      },
    });
  }
}
