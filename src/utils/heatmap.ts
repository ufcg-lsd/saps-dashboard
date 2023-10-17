export const getHeatMapInterval = (
  heatMapData: Record<string, number>
): [number, number] => {
  const values = Object.values(heatMapData);
  const min = 0;
  const max = Math.max(...values);

  return [min, max];
};

export const getHeatMapOpacity = (
  heatMapInterval: [number, number],
  value: number
): number => {
  const [min, max] = heatMapInterval;
  const opacity = (value - min) / (max - min);

  return opacity;
};
