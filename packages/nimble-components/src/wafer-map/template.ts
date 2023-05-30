import { html, ref } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div ${ref('wafermapContainer')} class="wafer-map-container">

    </div>
    <div>
    <svg class="hover-layer">
                <rect
                    class="hover-rect ${x => x.hoverOpacity}"
                    transform="${x => x.hoverTransform}"
                    width="${x => x.hoverWidth}"
                    height="${x => x.hoverHeight}"
                />
        </svg>
    </div>
`;
