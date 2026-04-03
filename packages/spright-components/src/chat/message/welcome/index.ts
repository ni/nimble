import { attr } from '@ni/fast-element';
import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd,
    type FoundationElementDefinition,
    type StartEndOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message-welcome': ChatMessageWelcome;
    }
}

/**
 * SprightChatMessageWelcome configuration options
 * @public
 */
export type ChatMessageWelcomeOptions = FoundationElementDefinition & StartEndOptions;

/**
 * A Spright component for displaying a welcome chat message
 */
export class ChatMessageWelcome extends FoundationElement {
    @attr({ attribute: 'title' })
    public welcomeTitle?: string;

    @attr
    public subtitle?: string;
}
applyMixins(ChatMessageWelcome, StartEnd);

const sprightChatMessageWelcome = ChatMessageWelcome.compose({
    baseName: 'chat-message-welcome',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessageWelcome());
export const chatMessageWelcomeTag = 'spright-chat-message-welcome';
