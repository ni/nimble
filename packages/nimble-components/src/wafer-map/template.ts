import { html, repeat } from '@microsoft/fast-element';
import type { WaferMap } from '.';
import type { WaferMapDie } from './types';

// prettier-ignore
export const template = html<WaferMap>`
    <div>
        <ul>
            ${repeat(
        x => x.dies,
        html<WaferMapDie>` <li>
                    ${x => html<WaferMapDie>`dieX: ${x.x}, dieY: ${x.y}, value:
                        ${x.value}%`}
                </li>`
    )}
        </ul>
    </div>
`;
