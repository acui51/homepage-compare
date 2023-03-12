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
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {items.map((item, i) => (
            <div key={i.toString()} className="flex flex-row">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color.fill }}
              />
              <div className="ml-2"><p className='text-xs'>{item.label}</p></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col max-w-xs">
          <p className='flex max-w-x text-xs'>“{winningTerm}” is the most common term found in the coverage from the selected date range.</p>
        </div>
      </div>
    </div>
  );
}
