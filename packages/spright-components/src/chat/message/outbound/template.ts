import { html, ViewTemplate } from '@ni/fast-element';
import type { FoundationElementTemplate } from '@ni/fast-foundation';
import type { ChatMessageOutbound } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<ChatMessageOutbound>
> = () => html<ChatMessageOutbound>`
    <div class="container">
        <section class="message-content">
            <slot></slot>
        </section>
    </div>
`;
