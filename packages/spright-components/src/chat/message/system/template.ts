import { html, ViewTemplate } from '@ni/fast-element';
import type { FoundationElementTemplate } from '@ni/fast-foundation';
import type { ChatMessageSystem } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<ChatMessageSystem>
> = () => html<ChatMessageSystem>`
    <div class="container">
        <section class="message-content">
            <slot></slot>
        </section>
    </div>
`;
