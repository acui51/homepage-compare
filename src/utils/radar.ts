// Check out documentation: https://airbnb.io/visx/radar

export interface RadarProminence {
    name: string;
    prominence: number;
}

export const y = (d: RadarProminence) => d.prominence;

export const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle: i * (360 / length) + (length % 2 === 0 ? 0 : 360 / length / 2),
  }));

export const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};

export function genPolygonPoints<Datum>(
    dataArray: Datum[],
    scale: (n: number) => number,
    getValue: (d: Datum) => number,
  ) {
    const step = (Math.PI * 2) / dataArray.length;
    const points: { x: number; y: number }[] = new Array(dataArray.length).fill({ x: 0, y: 0 });
    const pointString: string = new Array(dataArray.length + 1).fill('').reduce((res, _, i) => {
      if (i > dataArray.length) return res;
      const xVal = scale(getValue(dataArray[i - 1])) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i - 1])) * Math.cos(i * step);
      points[i - 1] = { x: xVal, y: yVal };
      res += `${xVal},${yVal} `;
      return res;
    });
  
    return { points, pointString };
}

export type RadarProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
};