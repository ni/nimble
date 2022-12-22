import { html, ref } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div class="wafer-map-container">
        <svg class="svg-root">
            <g class="zoom-container" ${ref('zoomContainer')}>
                <g class="${x => x.orientation}">               
                    <svg class="circle-base" version="1.1" x="0px" y="0px" viewbox="1 .45 20 21">
                        <path class="circle-drawing-path" d="m 21 12 a 10 10 330 1 1 0 -1.98 a 1 1 0 0 0 0 2"/>
                    </svg>
                </g>
            </g>
            <svg width=500 height="500">
                <rect 
                    x="0"  
                    y="0" 
                    fill="black" 
                    opacity="0.7" 
                    width="22.44897959183673" 
                    height="22.44897959183673" 
                    style="pointer-events: none;" 
                    transform="translate(148.69047619047618,70.11904761904762)"
                    ${ref('rect')}
                >
                </rect>
            </svg>
        </svg>
        <div class="wafer-map-area" style="left: 0px; top: 0px">
            <canvas width=500 height="500" ${ref('canvas')}>
        </div>
    </div>
`;
