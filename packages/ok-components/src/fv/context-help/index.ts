import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import '@ni/nimble-components/dist/esm/icons/info-circle';
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

/**
 * An info trigger with an attached tooltip for lightweight contextual guidance.
 */
export class FvContextHelp extends FoundationElement {
    @attr
    public text = '';

    @attr({ attribute: 'trigger-label' })
    public triggerLabel = 'Show help';

    @attr
    public severity: FvContextHelpSeverity;

    @attr({ attribute: 'icon-visible', mode: 'boolean' })
    public iconVisible = false;

    /** @internal */
    public readonly tooltipAnchorId = uniqueId('ok-fv-context-help');
}

const okFvContextHelp = FvContextHelp.compose({
    baseName: 'fv-context-help',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvContextHelp());
export const fvContextHelpTag = 'ok-fv-context-help';