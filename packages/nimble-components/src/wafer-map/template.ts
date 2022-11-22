import { html } from '@microsoft/fast-element';
import type { WaferMap } from '.';
import { html } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div class="waferMapContainer wafermap-default"}>
        <svg class="svgRoot" width="${x => x.offsetWidth}" heigth="${x => x.offsetHeight}">
            <g class="zoomContainer">
                <g transform="translate ${x => x.dataModule?.margin.left}, ${x => x.dataModule?.margin.top}"><g>
            </g>
        </svg>
    </div>
`;
// prettier-ignore
export const template = html<WaferMap>`
    <template>
        <svg class="circleBase" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewbox="1 .45 20 20.08">
            <path d="m 21 12 a 10 10 330 1 1 0 -3 a 1 1 0 0 0 0 3"/>
        </svg>
    </template>
`;