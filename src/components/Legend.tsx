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
    winningTerm: string;
};

export default function Legend({ items, winningTerm }: LegendProps) {
  // two column layout with tailwind
  return (
    <div className="flex flex-col max-w-md" style={{marginTop: -80}}>

        <div className="flex flex-col">
          <p>dofhusdofhofuid</p>
          <div className="flex items-center flex-row">
            <div className="w-4 h-4 mr-2 rounded-sm" style={{backgroundColor: 'white'}}></div>
            <div className='max-width-prose'>
              <p className='flex max-w-x text-xs'>“{winningTerm}” is the most common term found in the coverage from the selected date range.</p>
            </div>

    
          </div>
          <div className="flex flex-row justify-around">
        <div className="flex flex-row">
          {items.map((item, i) => (
        <div key={i.toString()} className="flex items-center">
        <div className="w-4 h-4 mr-2 rounded-sm" style={{backgroundColor: item.color.fill}}></div>
        <div>{item.label}</div>
      </div>
          ))}
          </div>
          </div>
        </div>
    </div>
  );
}
