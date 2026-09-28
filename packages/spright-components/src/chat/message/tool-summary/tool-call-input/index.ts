import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatToolCallInputValueType } from '../types';
import { formatToolCallInputValue } from '../utilities';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-tool-call-input': ChatToolCallInput;
    }
}

/**
 * A named input passed to a chat tool call.
 */
export class ChatToolCallInput extends FoundationElement {
    /** The input name. */
    @attr public name: string | undefined;

    /** The serialized input value. */
    @attr public value: string | undefined;

    /** The interpretation applied to the serialized value. */
    @attr({ attribute: 'value-type' })
    public valueType: ChatToolCallInputValueType = ChatToolCallInputValueType.string;

    /** @internal */
    public get formattedValue(): string {
        return formatToolCallInputValue(this.value, this.valueType);
    }
}

const sprightChatToolCallInput = ChatToolCallInput.compose({
    baseName: 'chat-tool-call-input',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightChatToolCallInput());
export const chatToolCallInputTag = 'spright-chat-tool-call-input';