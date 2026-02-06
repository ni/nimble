import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { keyEnter } from '@ni/fast-web-utilities';
import { attr, nullableNumberConverter, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { ChatInputSendEventDetail, ChatInputStopEventDetail } from './types';

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

    @attr({ attribute: 'stop-button-label' })
    public stopButtonLabel?: string;

    @attr
    public value = '';

    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    @attr({ attribute: 'maxlength', converter: nullableNumberConverter })
    public maxLength?: number = -1;

    @attr({ attribute: 'processing', mode: 'boolean' })
    public processing = false;

    /**
     * @internal
     */
    @observable
    public textArea?: HTMLTextAreaElement;

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
        this.value = this.textArea!.value;
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
        this.textArea!.value = this.value;
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
            text: this.textArea!.value
        };
        this.resetInput();
        this.$emit('send', eventDetail);
    }

    /**
     * @internal
     */
    public stopButtonClickHandler(): void {
        if (this.processing === false) {
            return;
        }
        const eventDetail: ChatInputStopEventDetail = {};
        this.$emit('stop', eventDetail);
    }

    private shouldDisableSendButton(): boolean {
        return this.textArea!.value.length === 0;
    }

    private resetInput(): void {
        this.value = '';
        this.disableSendButton = true;
        if (this.textArea) {
            this.textArea.value = '';
            this.textArea.focus();
        }
    }
}

const sprightChatInput = ChatInput.compose({
    baseName: 'chat-input',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatInput());
export const chatInputTag = 'spright-chat-input';
