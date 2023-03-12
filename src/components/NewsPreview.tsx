import React from 'react';
import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { Line, LineRadial } from '@visx/shape';
import type { RadarProminence } from '../utils/radar';
import { genAngles, genPoints, genPolygonPoints, y } from '../utils/radar';
import _ from 'lodash';
import Legend from './Legend';

export type PolygonColor = {
  stroke: string;
  fill: string;
}

const peterRiver = '#3498db';
const belizeHole = '#2980b9';
const emerald = "#2ecc71"
const nephritis = "#27ae60"
const carrot = "#e67e22"
const pumpkin = "#d35400"

const defaultColors = {
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
    previews: {
      [key: string]: RadarProminence[]
    }
    
    /**
     * margin for mini Radar
     * default: { top: 40, left: 80, right: 80, bottom: 80 }
     * */
    margin?: { top: number; right: number; bottom: number; left: number };

    colors?: {
      [key: string]: PolygonColor
    }
}

export default function NewsPreview({ previews, margin = defaultMargin, colors = defaultColors }: NewsPreviewProps) {
  const nLevels = 5
  const width = 400
  const height = 400
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;
  const positionScaleFactor = 1.1;
  const radialScale = (d: number) => d * Math.PI / 180;
  const verticalScales = Object.values(previews).map((d) => {
    return (n: number) => n * radius / Math.max(...d.map(y))
  })
  
  const maxLength = _.maxBy(Object.values(previews), (d) => d.length)?.length ?? 0;
  const webs = genAngles(maxLength)
  const vertices = genPoints(maxLength, radius);
  const labelPositions = genPoints(maxLength, (positionScaleFactor + 0.05) * radius, positionScaleFactor);
  const nodePositions = Object.values(previews).map((d, i) => {
    const scaleLength = verticalScales[i]
    return genPolygonPoints(d, (d) => scaleLength(d) ?? 0, y)
  });
  
  const origin = new Point({ x: 0, y: 0 });
  const labels = Object.values(previews)[0].map((d) => d.name);

  function termOfMaxProminence(d: RadarProminence[][]) {
    return _.maxBy(_.flatten(d), (d) => d.prominence)?.name ?? undefined
  }

  const legendItems = [
    {
      label: "The Washington Post",
      color: colors["the-washington-post"]
    },
    {
      label: "The Wall Street Journal",
      color: colors["wsj"]
    },

    {
      label: "Fox News",
      color: colors["fox-news"]
    }
  ]

  return (
    <div className='w-full flex flex-col justify-center items-center'>
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
          {labelPositions.map((point, i) => (
            <React.Fragment key={`radar-point-${i}`}>
              <text key={`radar-point-text-${i}`} x={point.x} y={point.y} dx={0} dy={0} fontSize={12} fill={"#2E3646"} textAnchor="middle">{labels[i]}</text>
            </React.Fragment>
          ))}
          {Object.entries(previews)?.map(([sourceId, radarData], i) => (
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
              <polygon points={nodePositions[i].pointString} fill={colors[sourceId].fill} fillOpacity={0.3} stroke={colors[sourceId].stroke} strokeWidth={1} />
              {nodePositions[i].points.map((point, i) => (
                <React.Fragment key={`radar-point-${i}`}>
                  <circle key={`radar-point-${i}`} cx={point.x} cy={point.y} r={4} fill={colors[sourceId].fill} />
                </React.Fragment>
              ))}
              
            </React.Fragment>
          ))}
        </Group>
      </svg>
      <Legend items={legendItems} winningTerm={termOfMaxProminence(Object.values(previews))} />
    </div>
  )
}