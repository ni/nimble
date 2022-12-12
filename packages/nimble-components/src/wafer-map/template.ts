import { html, ref } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div class="waferMapContainer">
        <svg class="svgRoot" ${ref('svgRoot')} >
            <g class="zoomContainer" ${ref('zoomContainer')}>               
                <svg class="circleBase " version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="1 .45 20 21">
                    <path class="circleDrawingPath" d="m 21 12 a 10 10 330 1 1 0 -1.98 a 1 1 0 0 0 0 2"/>
                </svg>
            </g>
        </svg>
        <div class="waferMapArea" style="left: 0px; top: 0px">
            <canvas width="500" height="500" ${ref('canvas')}>
        </div>
    </div>
`;
