import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import '@ni/nimble-components/dist/esm/icons/info';
import '@ni/nimble-components/dist/esm/tooltip';
import { styles } from './styles';
import { template } from './template';
import type { FvContextHelpSeverity } from './types';

export type { FvContextHelpSeverity };

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-context-help': FvContextHelp;
    }
}

let contextHelpId = 0;

/**
 * An info trigger with an attached tooltip for lightweight contextual guidance.
 */
export class FvContextHelp extends FoundationElement {
    @attr
    public text = '';

    @attr
    public severity: FvContextHelpSeverity;

    @attr({ attribute: 'icon-visible', mode: 'boolean' })
    public iconVisible = false;

    public readonly tooltipAnchorId = `ok-fv-context-help-${contextHelpId += 1}`;
}

const okFvContextHelp = FvContextHelp.compose({
    baseName: 'fv-context-help',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvContextHelp());
export const fvContextHelpTag = 'ok-fv-context-help';