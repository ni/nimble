/* eslint-disable max-classes-per-file */
import { attr, customElement, observable } from '@ni/fast-element';
import {
    applyMixins,
    FoundationElement,
    StartEnd,
    type FoundationElementDefinition,
    type StartEndOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatMessageType } from './types';
import { elementDefinitionContextMock } from '../../utilities/models/mock';

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
 * ChatMessage Mixins Helper
 */
class ChatMessageMixins extends FoundationElement {}
applyMixins(ChatMessageMixins, StartEnd);
interface ChatMessageMixins extends StartEnd, FoundationElement {}

/**
 * A Spright component for displaying a chat message
 */
@customElement({
    name: chatMessageTag,
    template: template(elementDefinitionContextMock, {}),
    styles
})
export class ChatMessage extends ChatMessageMixins {
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
