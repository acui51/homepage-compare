import React from 'react';

interface RadarProminence {
    entity: string;
    prominence: number;
}

type NewsPreviewProps = {
    /**
     * data for rendering polygon in mini Radar
    **/
    radarData: RadarProminence[];
}

export default function NewsPreview({ radarData }: NewsPreviewProps) {
    return (
        <div>
            <h1>News Preview</h1>
        </div>
    )
}