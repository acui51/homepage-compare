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
    winningTerm?: string;
};

export default function Legend({ items, winningTerm }: LegendProps) {
  return (
    <div className="flex flex-col max-w-md" style={{marginTop: -80}}>
      <div className="flex flex-col">
        
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-row">
            {items.map((item, i) => (
              <div key={i.toString()} className="flex items-center px-1">
                <div className="w-4 h-4 mr-2 rounded-sm" style={{backgroundColor: item.color.fill}}></div>
                <div>
                  <p className='text-xs'>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {winningTerm && (
          <div className="flex flex-row justify-start px-2 py-2">
            <p className='flex max-w-x text-sm text-left'>“{winningTerm}” is the most common term found in the coverage from the selected date range.</p>
          </div>
        )}
      </div>
    </div>
  );
}
