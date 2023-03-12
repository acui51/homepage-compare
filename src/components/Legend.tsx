import React from 'react';
import { PolygonColor } from './NewsPreview';

export type LegendProps = {
    /**
     * items for rendering legend (name and color)
     * */
    items: {
        label: string;
        color: PolygonColor;
    }[];
};

export default function Legend({ items }: LegendProps) {
  return (
    <div className='flex flex-row align-baseline'>
      <div className="flex flex-col" style={{marginTop: -80}}>
        {items.map((item, i) => (
          // use tailwindcss to style legend
        <div key={i.toString()} className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded-sm" style={{backgroundColor: item.color.fill}}></div>
          <div>{item.label}</div>
        </div>
      ))}
      </div>
      {/* another div to take up the rest of the horizontal space */}
      <div className="flex flex-col">
        <p>dsfojh</p>
      </div>
      </div>
    );
}