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
import { ChatMessageType } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message': ChatMessage;
    }
}

/**
 * SprightChatMessage configuration options
 * @public
 */
export type ChatMessageOptions = FoundationElementDefinition & StartEndOptions;

/**
 * A Spright component for displaying a chat message
 * @deprecated Use specific message component types instead
 */
export class ChatMessage extends FoundationElement {
    /**
     * @public
     * The message type of this message in the chat conversation
     * @remarks
     * HTML Attribute: message-type
     */
    @attr({ attribute: 'message-type' })
    public messageType: ChatMessageType = ChatMessageType.system;

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
        this.footerActionsIsEmpty = next === undefined || next.length === 0;
    }
}
applyMixins(ChatMessage, StartEnd);

const sprightChatMessage = ChatMessage.compose({
    baseName: 'chat-message',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessage());
export const chatMessageTag = 'spright-chat-message';
