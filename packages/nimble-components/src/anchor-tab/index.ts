import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElementDefinition,
    StartEndOptions
} from '@microsoft/fast-foundation';
import { AnchorBase } from '../anchor-base';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-tab': AnchorTab;
    }
}

export type TabOptions = FoundationElementDefinition & StartEndOptions;

/**
 * A nimble-styled link tab
 */
export class AnchorTab extends AnchorBase {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled = false;

    /**
     * Indicates the current "selected" state of various widgets.
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-selected}
     *
     * @public
     * @remarks
     * HTML Attribute: aria-selected
     */
    @attr({ attribute: 'aria-selected' })
    public override ariaSelected = 'false';
}

// FoundationAnchor already applies the StartEnd mixin, so we don't need to do it here.

const nimbleAnchorTab = AnchorTab.compose({
    baseName: 'anchor-tab',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorTab());
export const anchorTabTag = DesignSystem.tagFor(AnchorTab);
