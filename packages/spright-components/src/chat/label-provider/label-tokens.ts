import { DesignToken } from '@ni/fast-foundation';
import { chatLabelDefaults } from './label-token-defaults';

function createLabelToken<Name extends keyof typeof chatLabelDefaults>(
    name: Name
): DesignToken<string> {
    return DesignToken.create<string>({
        name: name.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`),
        cssCustomPropertyName: null
    }).withDefault(chatLabelDefaults[name]);
}

export const toolCallPendingLabel = createLabelToken('toolCallPendingLabel');
export const toolCallSuccessLabel = createLabelToken('toolCallSuccessLabel');
export const toolCallWarningLabel = createLabelToken('toolCallWarningLabel');
export const toolCallErrorLabel = createLabelToken('toolCallErrorLabel');
export const toolCallCanceledLabel = createLabelToken('toolCallCanceledLabel');
export const toolCallDeclinedLabel = createLabelToken('toolCallDeclinedLabel');
export const toolCallTerminatedLabel = createLabelToken('toolCallTerminatedLabel');
export const toolCallUnknownLabel = createLabelToken('toolCallUnknownLabel');
export const toolSummaryCalledOneLabel = createLabelToken('toolSummaryCalledOneLabel');
export const toolSummaryCalledManyLabel = createLabelToken('toolSummaryCalledManyLabel');
export const toolSummaryExpandLabel = createLabelToken('toolSummaryExpandLabel');
export const toolSummaryCollapseLabel = createLabelToken('toolSummaryCollapseLabel');