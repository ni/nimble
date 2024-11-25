import { html } from '@microsoft/fast-element';
import type { ChatTextBubble } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatTextBubble>`
    <template>
        <div>
            ${x => x.text}
        </div>
    </template>
`;
/* eslint-enable @typescript-eslint/indent */
