import { html, repeat } from '@microsoft/fast-element';
import type { WaferMap } from '.';
import type { WaferMapDie } from './types';

const notReadyTemplate = html<WaferMap>` <div>Loading....</div> `;

const waferTemplate = html<WaferMap>`
    <div>
        <ul>
            ${repeat(
        x => x.dies,
        html`
                    <li>
                        ${(x: WaferMapDie) => {
        return `dieX: ${x.x}, dieY: ${x.y}, value: ${x.value}%`;
    }}
                    </li>
                `
    )}
            <ul>
                <div></div>
            </ul>
        </ul>
    </div>
`;

export const template = html<WaferMap>`
    <div>
        ${x => {
        if (x.renderReady) {
            return waferTemplate;
        }
        return notReadyTemplate;
    }}
    </div>
`;
