import { observable } from '@ni/fast-element';
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
        'spright-chat-message-inbound': ChatMessageInbound;
    }
}

/**
 * SprightChatMessageInbound configuration options
 * @public
 */
export type ChatMessageInboundOptions = FoundationElementDefinition & StartEndOptions;

/**
 * A Spright component for displaying a chat message
 */
export class ChatMessageInbound extends FoundationElement {
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
applyMixins(ChatMessageInbound, StartEnd);

const sprightChatMessageInbound = ChatMessageInbound.compose({
    baseName: 'chat-message-inbound',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessageInbound());
export const chatMessageInboundTag = 'spright-chat-message-inbound';
