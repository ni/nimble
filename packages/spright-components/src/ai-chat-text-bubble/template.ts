import { html } from '@microsoft/fast-element';
import type { AIChatTextBubble } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<AIChatTextBubble>`
    <template>
        <div>
            ${x => x.text}
        </div>
    </template>
`;
/* eslint-enable @typescript-eslint/indent */
