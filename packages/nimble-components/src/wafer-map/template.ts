import { html, ref } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
    <div ${ref('wafermapContainer')} class="wafer-map-container">
    </div>
`;
