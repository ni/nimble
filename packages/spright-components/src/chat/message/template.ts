import { html } from '@ni/fast-element';
import type { ChatMessage } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatMessage>`
    <div class="root">
        <section class="message-content">
            <slot></slot>
        </section>
        <section>
           <slot class="footer-actions" name="footer-actions"></slot>
        </section>
        <slot class="followup" name="followup-prompt"></slot>
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
