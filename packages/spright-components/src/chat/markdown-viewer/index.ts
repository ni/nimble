import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd,
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-markdown-viewer': ChatMarkdownViewer;
    }
}

/**
 * A Spright component for displaying a chat markdown viewer
 */
export class ChatMarkdownViewer extends FoundationElement {
}
applyMixins(ChatMarkdownViewer, StartEnd);

const sprightChatMarkdownViewer = ChatMarkdownViewer.compose({
    baseName: 'chat-markdown-viewer',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMarkdownViewer());
export const chatMarkdownViewerTag = 'spright-chat-markdown-viewer';
