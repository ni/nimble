import { attr, observable } from '@ni/fast-element';
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
import { ChatMarkdownViewerType } from './types';

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
    /**
     * @public
     * The message type of this message in the chat conversation
     * @remarks
     * HTML Attribute: message-type
     */
    @attr({ attribute: 'message-type' })
    public messageType: ChatMarkdownViewerType = ChatMarkdownViewerType.system;

    /** @internal */
    @observable
    public footerActionsIsEmpty = true;

    /** @internal */
    @observable
    public readonly slottedFooterActionsElements?: HTMLElement[];

    public slottedFooterActionsElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.footerActionsIsEmpty = !next?.length;
    }
}
applyMixins(ChatMarkdownViewer, StartEnd);

const sprightChatMarkdownViewer = ChatMarkdownViewer.compose({
    baseName: 'chat-markdown-viewer',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMarkdownViewer());
export const chatMarkdownViewerTag = 'spright-chat-markdown-viewer';
