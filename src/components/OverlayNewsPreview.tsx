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

export type OverlayNewsPreviewProps = {
    /**
     * data for rendering polygon in mini Radar
    **/
    radarData: RadarProminence[];
    
    /**
     * margin for mini Radar
     * default: { top: 40, left: 80, right: 80, bottom: 80 }
     * */
    margin?: { top: number; right: number; bottom: number; left: number };
    sources: any
}

export default function OverlayNewsPreview({ sources, margin = defaultMargin }: OverlayNewsPreviewProps) {
  const nLevels = 5
  const width = 400
  const height = 400
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;
  const positionScaleFactor = 1.1;

  const radialScale = (d: number) => d * (Math.PI * 2) / 360;
  const verticalScale = (d: number) => d * radius / 5;

  const webs = sources?.map(source => genAngles(source.length));
  const vertices = sources?.map(source => genPoints(source.length, radius));
  const labelPositions = sources?.map(source => genPoints(source.length, (positionScaleFactor + 0.05) * radius, positionScaleFactor));
  const nodePositions = sources?.map(source => genPolygonPoints(source, (d) => verticalScale(d) ?? 0, y));
  const origin = new Point({ x: 0, y: 0 });
  
  return sources && (
    <div className='w-full flex justify-center items-center'>
      <svg width={width} height={height}>
        <rect fill={background} width={width} height={height} rx={14} />
        {/* stack polygons on top of one another */}
        <Group top={height / 2 - margin.top} left={width / 2}>
          {[...new Array(nLevels)].map((_, i) => (
            <LineRadial

              key={`web-${i}`}
              data={webs[i]}
              angle={(d) => radialScale(d.angle) ?? 0}
              radius={((i + 1) * radius) / nLevels}
              fill="none"
              stroke={silver}
              strokeWidth={2}
              strokeOpacity={0.8}
            />
          ))}
          {sources.map((source, i) => (
            <Group key={`polygon-${i}`}>
              <Line

                data={nodePositions[i]}
                x={(d) => d.x}
                y={(d) => d.y}
                fill={peterRiver}
                fillOpacity={0.2}
                stroke={peterRiver}
                strokeWidth={2}
                strokeOpacity={0.8}
              />
              {source.map((_, j) => (
                <Group key={`label-${j}`}>
                  <Line

                    from={origin}
                    to={labelPositions[i][j]}
                    stroke={belizeHole}
                    strokeWidth={2}
                    strokeOpacity={0.8}
                  />
                  <circle
                    cx={labelPositions[i][j].x}
                    cy={labelPositions[i][j].y}
                    r={4}
                    fill={belizeHole}
                    stroke={background}
                    strokeWidth={2}
                    strokeOpacity={0.8}
                  />
                </Group>
              ))}
            </Group>
          ))}
        </Group>
      </svg>
    </div>
  )
}