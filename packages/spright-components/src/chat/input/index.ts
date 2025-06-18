import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { keyEnter } from '@ni/fast-web-utilities';
import { attr, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { ChatInputSendEventDetail } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-input': ChatInput;
    }
}

/**
 * A Spright component for composing and sending a chat message
 */
export class ChatInput extends FoundationElement {
    @attr
    public placeholder?: string;

    @attr({ attribute: 'send-button-label' })
    public sendButtonLabel?: string;

    @attr
    public value = '';

    /**
     * @internal
     */
    @observable
    public textArea!: HTMLTextAreaElement;

    /**
     * @internal
     */
    @observable
    public disableSendButton = true;

    /**
     * @internal
     */
    public textAreaKeydownHandler(e: KeyboardEvent): boolean {
        if (e.key === keyEnter && !e.shiftKey) {
            this.sendButtonClickHandler();
            return false;
        }
        return true;
    }

    /**
     * @internal
     */
    public textAreaInputHandler(): void {
        this.value = this.textArea.value;
        this.disableSendButton = this.shouldDisableSendButton();
    }

    /**
     * @internal
     */
    public valueChanged(): void {
        if (this.textArea) {
            this.textArea.value = this.value;
            this.disableSendButton = this.shouldDisableSendButton();
        }
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.textArea.value = this.value;
        this.disableSendButton = this.shouldDisableSendButton();
    }

    /**
     * @internal
     */
    public sendButtonClickHandler(): void {
        if (this.shouldDisableSendButton()) {
            return;
        }
        const eventDetail: ChatInputSendEventDetail = {
            text: this.textArea.value
        };
        this.$emit('send', eventDetail);
        this.value = '';
        this.textArea.value = '';
        this.textArea.focus();
        this.disableSendButton = true;
    }

    private shouldDisableSendButton(): boolean {
        return this.textArea.value.length === 0;
    }
}

const sprightChatInput = ChatInput.compose({
    baseName: 'chat-input',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatInput());
export const chatInputTag = 'spright-chat-input';
