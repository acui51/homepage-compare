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
              <div className="ml-2">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col flex-1/2">
          <p className='max-w-sm'>In publishing and graphic design, {winningTerm} Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
        </div>
      </div>
    </div>
  );
}
