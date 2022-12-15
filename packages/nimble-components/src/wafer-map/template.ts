import { html, ref } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div class="wafer-map-container">
        <svg class="svg-root ${x => x.orientation}">
            <g class="zoom-container" ${ref('zoomContainer')}>               
                <!-- <svg class="circle-base" version="1.1" x="0px" y="0px" viewbox="0 0 22.07 22.05">
                    <path class="circle-drawing-path" d="m 22 11.55 a 11 11 330 1 1 0 -1 a 0.5 0.5 0 0 0 0 1"/>
                </svg> -->
                <svg class="circle-base" version="1.1" x="0px" y="0px" viewbox="0 0 40 40">
                    <path class="circle-drawing-path" d="m 40 20.5 a 20 20 330 1 1 0 -1 a 0.5 0.5 0 0 0 0 1"/>
                </svg>
            </g>
        </svg>
        <div class="wafer-map-area" style="left: 0px; top: 0px">
            <canvas width=500 height="500" ${ref('canvas')}>
        </div>
    </div>
`;
