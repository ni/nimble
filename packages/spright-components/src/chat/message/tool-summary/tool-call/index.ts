import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatToolCallStatus } from '../types';
import { normalizeToolCallStatus } from '../utilities';
import { getToolCallStatusLabel } from '../status-label';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-tool-call': ChatToolCall;
    }
}

/**
 * Status and invocation inputs for one chat tool call.
 */
export class ChatToolCall extends FoundationElement {
    /** The tool identity displayed to the user. */
    @attr public name: string | undefined;

    /** The runtime status of the tool call. */
    @attr public status: ChatToolCallStatus = ChatToolCallStatus.unknown;

    /** @internal */
    @observable public readonly slottedInputElements?: HTMLElement[];

    public override connectedCallback(): void {
        super.connectedCallback();
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'listitem');
        }
    }

    /** @internal */
    public get normalizedStatus(): ChatToolCallStatus {
        return normalizeToolCallStatus(this.status);
    }

    /** @internal */
    public get statusLabel(): string {
        return getToolCallStatusLabel(this, this.normalizedStatus);
    }
}

const sprightChatToolCall = ChatToolCall.compose({
    baseName: 'chat-tool-call',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightChatToolCall());
export const chatToolCallTag = 'spright-chat-tool-call';