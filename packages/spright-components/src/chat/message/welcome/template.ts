import { html, slotted, ViewTemplate, when } from '@ni/fast-element';
import type {
    FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMessageWelcome } from '.';
import { iconNigelChatTag } from '../../../icons/nigel-chat';

export const template: FoundationElementTemplate<
ViewTemplate<ChatMessageWelcome>
> = () => html<ChatMessageWelcome>`
    <div class="container">
        <div class="brand-icon">
            <slot name="brand-icon">
                <${iconNigelChatTag}></${iconNigelChatTag}>
            </slot>
        </div>
        ${when(x => x.welcomeTitle, html<ChatMessageWelcome>`
            <div class="title">${x => x.welcomeTitle}</div>
        `)}
        <div class="subtitle ${x => (!x.subtitle && x.subtitleIsEmpty ? 'subtitle-empty' : '')}">
            <slot name="subtitle" ${slotted({ property: 'slottedSubtitleElements' })}>${x => x.subtitle}</slot>
        </div>
        <section class="message-content">
            <slot></slot>
        </section>
    </div>
`;
