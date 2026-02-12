import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { keyEnter } from '@ni/fast-web-utilities';
import { attr, nullableNumberConverter, observable, html, DOM } from '@ni/fast-element';
import { mixinErrorPattern } from '@ni/nimble-components/dist/esm/patterns/error/types';
import { errorTextTemplate } from '@ni/nimble-components/dist/esm/patterns/error/template';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
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
export class ChatInput extends mixinErrorPattern(FoundationElement) {
    @attr
    public placeholder?: string;

    @attr({ attribute: 'send-button-label' })
    public sendButtonLabel?: string;

    @attr
    public value = '';

    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    @attr({ attribute: 'maxlength', converter: nullableNumberConverter })
    public maxLength?: number = -1;

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
     * The width of the vertical scrollbar, if displayed.
     * @internal
     */
    @observable
    public scrollbarWidth = -1;

    private resizeObserver?: ResizeObserver;
    private updateScrollbarWidthQueued = false;

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
        this.queueUpdateScrollbarWidth();
    }

    /**
     * @internal
     */
    public valueChanged(): void {
        if (this.textArea) {
            this.textArea.value = this.value;
            this.disableSendButton = this.shouldDisableSendButton();
            this.queueUpdateScrollbarWidth();
        }
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.textArea!.value = this.value;
        this.disableSendButton = this.shouldDisableSendButton();
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this);
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver?.disconnect();
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

    private onResize(): void {
        this.scrollbarWidth = this.textArea!.offsetWidth - this.textArea!.clientWidth;
    }

    private queueUpdateScrollbarWidth(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.updateScrollbarWidthQueued) {
            this.updateScrollbarWidthQueued = true;
            DOM.queueUpdate(() => this.updateScrollbarWidth());
        }
    }

    private updateScrollbarWidth(): void {
        this.updateScrollbarWidthQueued = false;
        this.scrollbarWidth = this.textArea!.offsetWidth - this.textArea!.clientWidth;
    }
}

const sprightChatInput = ChatInput.compose({
    baseName: 'chat-input',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: html<ChatInput>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatInput());
export const chatInputTag = 'spright-chat-input';
