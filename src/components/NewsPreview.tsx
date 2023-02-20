import React from 'react';
import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { Line, LineRadial } from '@visx/shape';

// Check out documentation: https://airbnb.io/visx/radar
const peterRiver = '#3498db';
const belizeHole = '#2980b9';
const silver = '#d9d9d9';
const background = '#FFFFFF';

const y = (d: RadarProminence) => d.prominence;

const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle: i * (360 / length) + (length % 2 === 0 ? 0 : 360 / length / 2),
  }));

const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};

function genPolygonPoints<Datum>(
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

const defaultMargin = { top: 40, left: 80, right: 80, bottom: 80 };

export type RadarProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
};

interface RadarProminence {
    entity: string;
    prominence: number;
}

type NewsPreviewProps = {
    /**
     * data for rendering polygon in mini Radar
    **/
    radarData: RadarProminence[];
    
    /**
     * margin for mini Radar
     * default: { top: 40, left: 80, right: 80, bottom: 80 }
     * */
    margin?: { top: number; right: number; bottom: number; left: number };
}

export default function NewsPreview({ radarData, margin = defaultMargin }: NewsPreviewProps) {
  const nLevels = 5
  const width = 400
  const height = 400
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = (d: number) => d * (Math.PI * 2) / 360;
  const verticalScale = (d: number) => d * radius / Math.max(...radarData.map(y));

  const webs = genAngles(radarData.length);
  const points = genPoints(radarData.length, radius);
  const polygonPoints = genPolygonPoints(radarData, (d) => verticalScale(d) ?? 0, y);
  const origin = new Point({ x: 0, y: 0 });
  
  return (
    <div className='w-full flex justify-center items-center'>
      <svg width={width} height={height}>
        <rect fill={background} width={width} height={height} rx={14} />
        <Group top={height / 2 - margin.top} left={width / 2}>
          {[...new Array(nLevels)].map((_, i) => (
            <LineRadial
              key={`web-${i}`}
              data={webs}
              angle={(d) => radialScale(d.angle) ?? 0}
              radius={((i + 1) * radius) / nLevels}
              fill="none"
              stroke={silver}
              strokeWidth={2}
              strokeOpacity={0.8}
              strokeLinecap="round"
            />
          ))}
          {[...new Array(radarData.length)].map((_, i) => (
            <Line key={`radar-line-${i}`} from={origin} to={points[i]} stroke={silver} />
          ))}
          <polygon points={polygonPoints.pointString} fill={peterRiver} fillOpacity={0.3} stroke={peterRiver} strokeWidth={1} />
          {polygonPoints.points.map((point, i) => (
            <circle key={`radar-point-${i}`} cx={point.x} cy={point.y} r={4} fill={belizeHole} />
          ))}
        </Group>
      </svg>
    </div>
  )
}