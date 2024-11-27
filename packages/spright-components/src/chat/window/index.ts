import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-window': ChatWindow;
    }
}

/**
 * A Spright component for displaying a chat window
 */
export class ChatWindow extends FoundationElement {

}

const sprightChatWindow = ChatWindow.compose({
    baseName: 'chat-window',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatWindow());
export const chatWindowTag = 'spright-chat-window';
