import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor,
    anchorTemplate as template,
    applyMixins,
    DelegatesARIALink,
    AnchorOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import type { AnchorAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor': Anchor;
    }
}

/**
 * A nimble-styled anchor
 */
export class Anchor extends FoundationAnchor {
    /**
     * @public
     * @remarks
     * HTML Attribute: underline-visible
     */
    @attr({ attribute: 'underline-visible', mode: 'boolean' })
    public underlineVisible = false;

    /**
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: AnchorAppearance;
}
applyMixins(Anchor, DelegatesARIALink);

const nimbleAnchor = Anchor.compose<AnchorOptions>({
    baseName: 'anchor',
    baseClass: FoundationAnchor,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchor());
