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