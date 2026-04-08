import { html, ViewTemplate, when } from '@ni/fast-element';
import type {
    FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMessageWelcome } from '.';
import { iconNigelChatTag } from '../../../icons/nigel-chat';

export const template: FoundationElementTemplate<
ViewTemplate<ChatMessageWelcome>
> = (_context, _definition) => html<ChatMessageWelcome>`
    <div class="container">
        <div class="brand-icon">
            <slot name="brand-icon">
                <${iconNigelChatTag}></${iconNigelChatTag}>
            </slot>
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
    </div>
`;
