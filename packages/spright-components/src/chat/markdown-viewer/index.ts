import {
    DesignSystem,
    FoundationElement,
} from '@ni/fast-foundation';
import { attr } from '@ni/fast-element';
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
    /**
     *
     * @public
     * Markdown string to render its corresponding rich text content in the component.
     * @remarks
     * HTML Attribute: markdown
     */
    @attr({ mode: 'fromView' })
    public markdown = '';

    /**
     * @internal
     */
    public markdownChanged(): void {
    }
}

const sprightChatMarkdownViewer = ChatMarkdownViewer.compose({
    baseName: 'chat-markdown-viewer',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMarkdownViewer());
export const chatMarkdownViewerTag = 'spright-chat-markdown-viewer';
