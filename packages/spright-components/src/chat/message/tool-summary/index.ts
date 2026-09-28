import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';
import { ChatToolCall, chatToolCallTag } from './tool-call';
import { ChatToolCallStatus } from './types';
import { getToolCallStatusLabel } from './status-label';
import {
    toolSummaryCalledManyLabel,
    toolSummaryCalledOneLabel,
    toolSummaryCollapseLabel,
    toolSummaryExpandLabel
} from '../../label-provider/label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message-tool-summary': ChatMessageToolSummary;
    }
}

/**
 * A grouped, collapsible summary of chat tool calls.
 */
export class ChatMessageToolSummary extends FoundationElement {
    /** Whether the ordered tool-call list is visible. */
    @attr({ mode: 'boolean' }) public expanded = false;

    /** @internal */
    @observable public readonly slottedToolCallElements?: HTMLElement[];

    /** @internal */
    @observable public toolCalls: ChatToolCall[] = [];

    /** @internal */
    public readonly toolCallListId = uniqueId('spright-tool-call-list-');

    private readonly childObserver = new MutationObserver(() => {
        this.updateToolCalls();
    });

    public override connectedCallback(): void {
        this.updateToolCalls();
        super.connectedCallback();
        this.childObserver.observe(this, {
            attributes: true,
            attributeFilter: ['name', 'status'],
            childList: true,
            subtree: true
        });
    }

    public override disconnectedCallback(): void {
        this.childObserver.disconnect();
        super.disconnectedCallback();
    }

    /** @internal */
    public get callCount(): number {
        return this.toolCalls.length;
    }

    /** @internal */
    public get normalizedStatus(): ChatToolCallStatus {
        const statuses = this.toolCalls.map(call => call.normalizedStatus);
        const precedence = [
            ChatToolCallStatus.pending,
            ChatToolCallStatus.error,
            ChatToolCallStatus.warning,
            ChatToolCallStatus.canceled,
            ChatToolCallStatus.declined,
            ChatToolCallStatus.terminated,
            ChatToolCallStatus.unknown,
            ChatToolCallStatus.success
        ];
        return precedence.find(status => statuses.includes(status))
            ?? ChatToolCallStatus.unknown;
    }

    /** @internal */
    public get summaryLabel(): string {
        if (this.normalizedStatus === ChatToolCallStatus.pending) {
            const pendingCalls = this.toolCalls.filter(
                call => call.normalizedStatus === ChatToolCallStatus.pending
            );
            if (pendingCalls.length === 1 && pendingCalls[0]!.name) {
                return `${pendingCalls[0]!.name}: ${getToolCallStatusLabel(this, ChatToolCallStatus.pending)}`;
            }
            return getToolCallStatusLabel(this, ChatToolCallStatus.pending);
        }
        const countTemplate = this.callCount === 1
            ? toolSummaryCalledOneLabel.getValueFor(this)
            : toolSummaryCalledManyLabel.getValueFor(this);
        return countTemplate.replace('{count}', String(this.callCount));
    }

    /** @internal */
    public get disclosureLabel(): string {
        return this.expanded
            ? toolSummaryCollapseLabel.getValueFor(this)
            : toolSummaryExpandLabel.getValueFor(this);
    }

    /** @internal */
    public toggleExpanded(): void {
        this.expanded = !this.expanded;
    }

    private updateToolCalls(): void {
        this.toolCalls = Array.from(this.children).filter(
            (element): element is ChatToolCall => element.matches(chatToolCallTag)
        );
    }
}

const sprightChatMessageToolSummary = ChatMessageToolSummary.compose({
    baseName: 'chat-message-tool-summary',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightChatMessageToolSummary());
export const chatMessageToolSummaryTag = 'spright-chat-message-tool-summary';