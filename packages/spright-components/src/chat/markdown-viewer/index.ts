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
        'spright-chat-markdown-viewer': ChatMarkdownViewer;
    }
}

/**
 * SprightChatMarkdownViewer configuration options
 * @public
 */
export type ChatMarkdownViewerOptions = FoundationElementDefinition & StartEndOptions;

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
