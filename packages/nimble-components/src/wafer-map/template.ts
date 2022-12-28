import { html, ref } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div class="wafer-map-container">
        <svg class="svg-root">
            <g class="zoom-container" ${ref('zoomContainer')}>
                <g class="${x => x.orientation}">
                    <svg class="circle-base" version="1.1" x="0px" y="0px" viewBox="0 0 41 41">
                        <path class="circle-drawing-path" d="m 40.5 21 a 20 20 1 1 1 0 -1 a 0.5 0.5 0 0 0 0 1" />
                    </svg>
                </g>
            </g>
        </svg>
        <div class="wafer-map-area">
            <canvas class="wafer-map-canvas" ${ref('canvas')}></canvas>
        </div>
    </div>
`;
