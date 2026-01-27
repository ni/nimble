import { html, slotted, ViewTemplate } from '@ni/fast-element';
import {
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMessageInbound } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<ChatMessageInbound>
> = () => html<ChatMessageInbound>`
    <div class="container">
        <section class="message-content">
            <slot></slot>
        </section>
        <section class="footer-actions ${x => (x.footerActionsIsEmpty ? '' : 'has-content')}">
           <slot 
                name="footer-actions"
                ${slotted({ property: 'slottedFooterActionsElements' })}
           ></slot>
        </section>
    </div>
`;
