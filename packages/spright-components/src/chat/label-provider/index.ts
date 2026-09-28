import { attr } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import {
    type DesignTokensFor,
    LabelProviderBase
} from '@ni/nimble-components/dist/esm/label-provider/base';
import { styles } from '@ni/nimble-components/dist/esm/label-provider/base/styles';
import * as labels from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'spright-label-provider-chat': LabelProviderChat;
    }
}

const supportedLabels = {
    toolCallPending: labels.toolCallPendingLabel,
    toolCallSuccess: labels.toolCallSuccessLabel,
    toolCallWarning: labels.toolCallWarningLabel,
    toolCallError: labels.toolCallErrorLabel,
    toolCallCanceled: labels.toolCallCanceledLabel,
    toolCallDeclined: labels.toolCallDeclinedLabel,
    toolCallTerminated: labels.toolCallTerminatedLabel,
    toolCallUnknown: labels.toolCallUnknownLabel,
    toolSummaryCalledOne: labels.toolSummaryCalledOneLabel,
    toolSummaryCalledMany: labels.toolSummaryCalledManyLabel,
    toolSummaryExpand: labels.toolSummaryExpandLabel,
    toolSummaryCollapse: labels.toolSummaryCollapseLabel
} as const;

/**
 * Label provider for Spright chat components.
 */
export class LabelProviderChat
    extends LabelProviderBase<typeof supportedLabels>
    implements DesignTokensFor<typeof supportedLabels> {
    @attr({ attribute: 'tool-call-pending' }) public toolCallPending: string | undefined;
    @attr({ attribute: 'tool-call-success' }) public toolCallSuccess: string | undefined;
    @attr({ attribute: 'tool-call-warning' }) public toolCallWarning: string | undefined;
    @attr({ attribute: 'tool-call-error' }) public toolCallError: string | undefined;
    @attr({ attribute: 'tool-call-canceled' }) public toolCallCanceled: string | undefined;
    @attr({ attribute: 'tool-call-declined' }) public toolCallDeclined: string | undefined;
    @attr({ attribute: 'tool-call-terminated' }) public toolCallTerminated: string | undefined;
    @attr({ attribute: 'tool-call-unknown' }) public toolCallUnknown: string | undefined;
    @attr({ attribute: 'tool-summary-called-one' }) public toolSummaryCalledOne: string | undefined;
    @attr({ attribute: 'tool-summary-called-many' }) public toolSummaryCalledMany: string | undefined;
    @attr({ attribute: 'tool-summary-expand' }) public toolSummaryExpand: string | undefined;
    @attr({ attribute: 'tool-summary-collapse' }) public toolSummaryCollapse: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const sprightLabelProviderChat = LabelProviderChat.compose({
    baseName: 'label-provider-chat',
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightLabelProviderChat());
export const labelProviderChatTag = 'spright-label-provider-chat';