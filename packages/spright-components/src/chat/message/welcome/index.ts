import { attr } from '@ni/fast-element';
import {
    DesignSystem,
    FoundationElement,
    type FoundationElementDefinition
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
export type ChatMessageWelcomeOptions = FoundationElementDefinition;

/**
 * A Spright component for displaying a welcome chat message
 */
export class ChatMessageWelcome extends FoundationElement {
    @attr({ attribute: 'welcome-title' })
    public welcomeTitle?: string;

    @attr
    public subtitle?: string;
}

const sprightChatMessageWelcome = ChatMessageWelcome.compose({
    baseName: 'chat-message-welcome',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessageWelcome());
export const chatMessageWelcomeTag = 'spright-chat-message-welcome';
