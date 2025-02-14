import { html } from '@microsoft/fast-element';
import type { ChatMessage } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatMessage>`
    <div>
        <span class="actions top">
            <slot class="left" name="top-left"></slot>
            <slot class="right" name="top-right"></slot>
        </span>
        <div class="message-content">
            <slot></slot>
        </div>
        <span class="actions bottom">
            <slot class="left" name="bottom-left"></slot>
            <slot class="right" name="bottom-right"></slot>
        </span>
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
