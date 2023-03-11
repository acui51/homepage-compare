import React from 'react';
import { StyledJsxStyleRegistry } from 'styled-jsx';
import NewsPreview, { NewsPreviewProps } from './NewsPreview';

type OverlayedNewsPreviewProps = {
  /** An array of radar data for rendering multiple charts */
  radarDataList: NewsPreviewProps['radarData'][];
  /** A margin object for the charts */
  margin?: NewsPreviewProps['margin'];
  /** A class name to apply to the chart container */
  className?: string;
};

const OverlayNewsPreview = ({ radarDataList, margin, className }: OverlayedNewsPreviewProps) => {
  const width = 400;
  const height = 400;
  const previewCount = radarDataList?.length ?? 0;


  return (
    <div className={className} style={{ position: 'relative', width: `${width}px`, height: `${height}px` }}>
      {radarDataList?.map((radarData, index) => (
        <div style={{
            position: "absolute",
            top: height / 2,
            left: width / 2,
            transform: "translate(-50%, -50%)"
        }} key={`preview-${index}`} style={{ zIndex: previewCount - index }}>
          <NewsPreview radarData={radarData} margin={margin} />
        </div>
      ))}
    </div>
  );
};

export default OverlayNewsPreview;
