import { html, ViewTemplate, when } from '@ni/fast-element';
import {
    endSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMessageWelcome, ChatMessageWelcomeOptions } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<ChatMessageWelcome>,
ChatMessageWelcomeOptions
> = (context, definition) => html<ChatMessageWelcome>`
    <div class="container">
        <div class="brand-icon">
            <slot name="brand-icon"></slot>
        </div>
        ${when(x => x.welcomeTitle, html<ChatMessageWelcome>`
            <div class="title">${x => x.welcomeTitle}</div>
        `)}
        ${when(x => x.subtitle, html<ChatMessageWelcome>`
            <div class="subtitle">${x => x.subtitle}</div>
        `)}
        <section class="message-content">
            <slot></slot>
        </section>
        ${endSlotTemplate(context, definition)}
    </div>
`;
