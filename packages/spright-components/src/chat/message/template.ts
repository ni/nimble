import { html, ViewTemplate } from '@ni/fast-element';
import {
    startSlotTemplate,
    endSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMessage, ChatMessageOptions } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<ChatMessage>,
ChatMessageOptions
> = (context, definition) => html<ChatMessage>`
    <div class="root">
        ${startSlotTemplate(context, definition)}
        <section class="message-content">
            <slot></slot>
        </section>
        <section>
           <slot class="footer-actions" name="footer-actions"></slot>
        </section>
        ${endSlotTemplate(context, definition)}
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
