import React from 'react';
import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { Line, LineRadial } from '@visx/shape';
import type { RadarProminence } from '../utils/radar';
import { genAngles, genPoints, genPolygonPoints, y } from '../utils/radar';
import _ from 'lodash';

const peterRiver = '#3498db';
const belizeHole = '#2980b9';
const emerald = "#2ecc71"
const nephritis = "#27ae60"
const carrot = "#e67e22"
const pumpkin = "#d35400"
const polygonColors = {
  "wsj": {
    stroke: nephritis,
    fill: emerald
  },
  "the-washington-post": {
    stroke: belizeHole,
    fill: peterRiver
  },
  "fox-news": {
    stroke: pumpkin,
    fill: carrot
  }
}
const silver = '#d9d9d9';
const background = '#FFFFFF';
const defaultMargin = { top: 40, left: 80, right: 80, bottom: 80 };

export type NewsPreviewProps = {
    /**
     * data for rendering polygon in mini Radar
    **/
    
    /**
     * margin for mini Radar
     * default: { top: 40, left: 80, right: 80, bottom: 80 }
     * */
    margin?: { top: number; right: number; bottom: number; left: number };
    /** 
     * fullMulti is like this:
     * {
     *    "wsj": [
     * {
     *  "name": "Economy",
     * "prominence": 0.5}
     * ],
     * "the-washington-post": [
     * {
     * "name": "Economy",
     * "prominence": 0.5
     * }
     * ]
     * }
     * **/
    fullMulti: {
      [key: string]: RadarProminence[]
    }
}

export default function NewsPreview({ margin = defaultMargin, fullMulti }: NewsPreviewProps) {
  const nLevels = 5
  const width = 400
  const height = 400
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;
  const positionScaleFactor = 1.1;
  const radialScale = (d: number) => d * Math.PI / 180;
  const verticalScale = (d: number) => d * radius * Math.max(...Object.values(fullMulti).map((d) => 1.25*positionScaleFactor*d.length)) / nLevels;
  const maxLength = _.maxBy(Object.values(fullMulti), (d) => d.length)?.length ?? 0;
  const webs = genAngles(maxLength)
  const vertices = genPoints(maxLength, radius);
  const labelPositions = genPoints(maxLength, (positionScaleFactor + 0.05) * radius, positionScaleFactor);
  const nodePositions = Object.values(fullMulti).map((d) => genPolygonPoints(d, (d) => verticalScale(d) ?? 0, y));
  function normalizePositions(positions: { points: { x: number, y: number }[], pointString: string }) {
    const { x, y } = positions.points[0];
    const normalizedPoints = positions.points.map((d) => ({ x: d.x - x, y: d.y - y }));
    return { points: normalizedPoints, pointString: normalizedPoints.map((d) => `${d.x},${d.y}`).join(' ') };
  }
  const normalizedNodePositions = nodePositions.map((d) => normalizePositions(d));
  const origin = new Point({ x: 0, y: 0 });
  const labels = Object.values(fullMulti)[0].map((d) => d.name);

  return (
    <div className='w-full flex justify-center items-center'>
      <svg width={width} height={height}>
        <rect fill={background} width={width} height={height} rx={14} />
        {/* stack two copies of the radar on top of each other to create a subtle shadow effect */}
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
          {labelPositions.map((point, i) => (
            <React.Fragment key={`radar-point-${i}`}>
              <text key={`radar-point-text-${i}`} x={point.x} y={point.y} dx={0} dy={0} fontSize={12} fill={"#2E3646"} textAnchor="middle">{labels[i]}</text>
            </React.Fragment>
          ))}
          {/* <polygon points={nodePositions.pointString} fill={peterRiver} fillOpacity={0.3} stroke={peterRiver} strokeWidth={1} />
          {labelPositions.map((point, i) => (
            <React.Fragment key={`radar-point-${i}`}>
              <text key={`radar-point-text-${i}`} x={point.x} y={point.y} dx={0} dy={0} fontSize={12} fill={belizeHole} textAnchor="middle">{radarData[i].name}</text>
            </React.Fragment>
          ))}
          {nodePositions.points.map((point, i) => (
            <React.Fragment key={`radar-point-${i}`}>
              <circle key={`radar-point-${i}`} cx={point.x} cy={point.y} r={4} fill={belizeHole} />
            </React.Fragment>
          ))} */}
          {/* {multi?.map((radarData, i) => (
            <React.Fragment key={`radar-${i}`}>
              {[...new Array(nLevels)].map((_, i) => (
                <LineRadial
                  key={`web-${i}`} 
                  data={multiWebs[i]}
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
                <Line key={`radar-line-${i}`} from={origin} to={multiVertices[i]} stroke={silver} />
              ))}
              <polygon points={multiNodePositions[i].pointString} fill={peterRiver} fillOpacity={0.3} stroke={peterRiver} strokeWidth={1} />
              {multiNodePositions[i].points.map((point, i) => (
                <React.Fragment key={`radar-point-${i}`}>
                  <circle key={`radar-point-${i}`} cx={point.x} cy={point.y} r={4} fill={belizeHole} />
                </React.Fragment>
              ))}
                <text>full: {JSON.stringify(fullMulti)}</text>
            </React.Fragment>
          ))} */}
          {Object.entries(fullMulti)?.map(([sourceId, radarData], i) => (
            <React.Fragment key={`radar-${i}`}>
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
              <polygon points={normalizedNodePositions[i].pointString} fill={polygonColors[sourceId].fill} fillOpacity={0.3} stroke={polygonColors[sourceId].stroke} strokeWidth={1} />
              {normalizedNodePositions[i].points.map((point, i) => (
                <React.Fragment key={`radar-point-${i}`}>
                  <circle key={`radar-point-${i}`} cx={point.x} cy={point.y} r={4} fill={polygonColors[sourceId].fill} />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}

        

        </Group>
      </svg>
    </div>
  )
}