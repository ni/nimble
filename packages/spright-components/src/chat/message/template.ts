import { html } from '@microsoft/fast-element';
import type { ChatMessage } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatMessage>`
    <div class="root">
        <span class="actions">
            <slot class="left dynamic" name="left"></slot>
            <span class="message-content">
                <slot></slot>
            </span>
        </span>
        <span class="actions">
            <slot class="left" name="left-bottom"></slot>
        </span>
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
