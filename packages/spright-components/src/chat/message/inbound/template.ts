import { html, slotted, ViewTemplate } from '@ni/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMessageInbound, ChatMessageInboundOptions } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<ChatMessageInbound>,
ChatMessageInboundOptions> = (context, definition) => html<ChatMessageInbound>`
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
