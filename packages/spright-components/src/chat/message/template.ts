import { html } from '@ni/fast-element';
import { toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';
import type { ChatMessage } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatMessage>`
    <div class="root">
        <section class="message-content">
            <slot></slot>
        </section>
        <section class="footer-actions">
            <${toolbarTag} >
                <slot name="footer-actions"></slot>
            </${toolbarTag}>
        </section>
        <slot class="followup" name="followup-prompt"></slot>
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
