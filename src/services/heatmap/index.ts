import heatMapMock from "public/heatmap-output-example.json";

const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || "150.165.15.82:8091";

export const getHeatMap = async () => {
  const heatMap: any[] = await new Promise((res, rej) => {
    setTimeout(() => {
      res(heatMapMock);
    }, 1000);
  });

  const regionByCount = heatMap.reduce((acc, curr) => {
    const { count, region } = curr;
    const regionCount = acc[region] || 0;

    const result = { ...acc };

    result[region] = regionCount + count;

    return result;
  }, {});

  return regionByCount;
};
