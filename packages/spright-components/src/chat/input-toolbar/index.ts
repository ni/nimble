import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
import { styles } from './styles';
import { template } from './template';
import type { ChatInputToolbarSubmitMessageEventDetail } from '../types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-input-toolbar': ChatInputToolbar;
    }
}

/**
 * A Spright component for collecting user chat input
 */
export class ChatInputToolbar extends FoundationElement {
    // TODO:
    // DISABLED
    // PLACEHOLDER
    // INPUT TEXT
    // TEST SLOTS

    /**
     * The placeholder text for the input field
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'placeholder' })
    public placeholder?: string;

    public textField?: TextField;

    /**
     * @internal
     */
    public onTextFieldKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.submitMessage();
        }
    }

    /**
     * @internal
     */
    public submitMessage(): void {
        if (!this.textField) {
            return;
        }
        const message = this.textField.value;
        const eventDetail: ChatInputToolbarSubmitMessageEventDetail = {
            message
        };
        this.textField.value = '';
        this.textField.focus();
        this.$emit('submit', eventDetail);
    }
}

const sprightChatInputToolbar = ChatInputToolbar.compose({
    baseName: 'chat-input-toolbar',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatInputToolbar());
export const chatInputToolbarTag = 'spright-chat-input-toolbar';
