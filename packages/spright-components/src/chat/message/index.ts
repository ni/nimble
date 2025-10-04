import { attr, customElement, observable } from '@ni/fast-element';
import {
    applyMixins,
    FoundationElement,
    StartEnd,
    type ElementDefinitionContext,
    type FoundationElementDefinition,
    type StartEndOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatMessageType } from './types';

export const chatMessageTag = 'spright-chat-message';

declare global {
    interface HTMLElementTagNameMap {
        [chatMessageTag]: ChatMessage;
    }
}

/**
 * SprightChatMessage configuration options
 * @public
 */
export type ChatMessageOptions = FoundationElementDefinition & StartEndOptions;

/**
 * A Spright component for displaying a chat message
 */
@customElement({
    name: chatMessageTag,
    template: template(undefined as unknown as ElementDefinitionContext, {}),
    styles
})
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
        this.footerActionsIsEmpty = !next?.length;
    }
}
applyMixins(ChatMessage, StartEnd);
