import { html } from '@microsoft/fast-element';
import type { ChatConversation } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatConversation>`
    <div>
        <slot></slot>
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
