import { html } from '@microsoft/fast-element';
import type { ChatMessage } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatMessage>`
    <div>
        <span class="actions">
            <slot class="left" name="top-left"></slot>
            <slot class="right" name="top-right"></slot>
        </span>
        <span class="actions center">
            <slot class="left" name="left"></slot>
            <div class="message-content">
                <slot></slot>
            </div>
        </span>
        <span class="actions">
            <slot class="left" name="bottom-left"></slot>
            <slot class="right" name="bottom-right"></slot>
        </span>
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
