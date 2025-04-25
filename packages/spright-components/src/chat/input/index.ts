import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import {
    keyEnter,
} from '@ni/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';
import { observable } from '@ni/fast-element';
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
    public keydownHandler(e: KeyboardEvent): boolean {
        if (e.key === keyEnter && !e.shiftKey) {
            this.onSubmit();
            return false;
        }
        return true;
    }

    public onSubmit(): void {
        const eventDetail: ChatInputSubmitEventDetail = {
            text: this.textArea.value
        };
        this.$emit('submit', eventDetail);
        this.textArea.value = '';
        this.textArea.focus();
    }
}

const sprightChatInput = ChatInput.compose({
    baseName: 'chat-input',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightChatInput());
export const chatInputTag = 'spright-chat-input';
