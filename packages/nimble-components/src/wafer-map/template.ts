import { html, ref } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div class="wafer-map-container">
        <svg class="svg-root">
            <g class="zoom-container" ${ref('zoomContainer')}>
                <g class="notch ${x => x.orientation}">
                    <svg
                        class="circle-base"
                        version="1.1"
                        x="0px"
                        y="0px"
                        viewBox="1 .45 20 21"
                    >
                        <path
                            class="circle-drawing-path"
                            d="m 21 12 a 10 10 330 1 1 0 -1.98 a 1 1 0 0 0 0 2"
                        />
                    </svg>
                </g>
            </g>
        </svg>
        <div class="wafer-map-area">
            <canvas class="wafer-map-canvas" ${ref('canvas')}></canvas>
        </div>
        <svg class="hover-layer">
            <rect fill="black" ${ref('rect')}/>
        </svg>
    </div>
`;
