import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { keyEnter } from '@ni/fast-web-utilities';
import { observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { ChatInputSubmitEventDetail } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-input': ChatInput;
    }
}

/**
 * A Spright component for displaying a series of chat messages
 */
export class ChatInput extends FoundationElement {
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
        this.disableSendButton = this.shouldDisableSendButton();
    }

    /**
     * @internal
     */
    public sendButtonClickHandler(): void {
        if (!this.shouldDisableSendButton()) {
            return;
        }
        const eventDetail: ChatInputSubmitEventDetail = {
            text: this.textArea.value
        };
        this.$emit('submit', eventDetail);
        this.textArea.value = '';
        this.textArea.focus();
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
