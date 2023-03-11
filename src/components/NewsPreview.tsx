import React from 'react';
import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { Line, LineRadial } from '@visx/shape';
import type { RadarProminence } from '../utils/radar';
import { genAngles, genPoints, genPolygonPoints, y } from '../utils/radar';

const peterRiver = '#3498db';
const belizeHole = '#2980b9';
const silver = '#d9d9d9';
const background = '#FFFFFF';
const defaultMargin = { top: 40, left: 80, right: 80, bottom: 80 };

export type NewsPreviewProps = {
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
  const positionScaleFactor = 1.1;

  const radialScale = (d: number) => d * (Math.PI * 2) / 360;
  const verticalScale = (d: number) => d * radius / Math.max(...radarData.map(y));

  const webs = genAngles(radarData.length);
  const vertices = genPoints(radarData.length, radius);
  const labelPositions = genPoints(radarData.length, (positionScaleFactor + 0.05) * radius, positionScaleFactor);
  const nodePositions = genPolygonPoints(radarData, (d) => verticalScale(d) ?? 0, y);
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
            <Line key={`radar-line-${i}`} from={origin} to={vertices[i]} stroke={silver} />
          ))}
          <polygon points={nodePositions.pointString} fill={peterRiver} fillOpacity={0.3} stroke={peterRiver} strokeWidth={1} />
          {labelPositions.map((point, i) => (
            <React.Fragment key={`radar-point-${i}`}>
              <text key={`radar-point-text-${i}`} x={point.x} y={point.y} dx={0} dy={0} fontSize={12} fill={belizeHole} textAnchor="middle">{radarData[i].name}</text>
            </React.Fragment>
          ))}
          {nodePositions.points.map((point, i) => (
            <React.Fragment key={`radar-point-${i}`}>
              <circle key={`radar-point-${i}`} cx={point.x} cy={point.y} r={4} fill={belizeHole} />
            </React.Fragment>
          ))}
        </Group>
      </svg>
    </div>
  )
}