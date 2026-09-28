import type { FoundationElement } from '@ni/fast-foundation';
import {
    toolCallCanceledLabel,
    toolCallDeclinedLabel,
    toolCallErrorLabel,
    toolCallPendingLabel,
    toolCallSuccessLabel,
    toolCallTerminatedLabel,
    toolCallUnknownLabel,
    toolCallWarningLabel
} from '../../label-provider/label-tokens';
import { ChatToolCallStatus } from './types';

/** @internal */
export function getToolCallStatusLabel(
    element: FoundationElement,
    status: ChatToolCallStatus
): string {
    switch (status) {
        case ChatToolCallStatus.pending:
            return toolCallPendingLabel.getValueFor(element);
        case ChatToolCallStatus.success:
            return toolCallSuccessLabel.getValueFor(element);
        case ChatToolCallStatus.warning:
            return toolCallWarningLabel.getValueFor(element);
        case ChatToolCallStatus.error:
            return toolCallErrorLabel.getValueFor(element);
        case ChatToolCallStatus.canceled:
            return toolCallCanceledLabel.getValueFor(element);
        case ChatToolCallStatus.declined:
            return toolCallDeclinedLabel.getValueFor(element);
        case ChatToolCallStatus.terminated:
            return toolCallTerminatedLabel.getValueFor(element);
        default:
            return toolCallUnknownLabel.getValueFor(element);
    }
}