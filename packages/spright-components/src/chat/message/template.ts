import { html, slotted, ViewTemplate } from '@ni/fast-element';
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
    <div class="container">
        ${startSlotTemplate(context, definition)}
        <section class="message-content">
            <slot></slot>
        </section>
        <section class="footer-actions ${x => (x.footerActionsIsEmpty ? '' : 'has-content')}">
           <slot 
                name="footer-actions"
                ${slotted({ property: 'slottedFooterActionsElements' })}
           ></slot>
        </section>
        ${endSlotTemplate(context, definition)}
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
