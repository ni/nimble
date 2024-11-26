import { html } from '@microsoft/fast-element';
import type { ChatMessage } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatMessage>`
    <template>
        <div>
            ${x => x.text}
        </div>
    </template>
`;
/* eslint-enable @typescript-eslint/indent */
