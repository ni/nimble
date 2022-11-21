import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor,
    anchorTemplate as template,
    applyMixins,
    DelegatesARIALink
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { AnchorAppearance, AnchorAppearanceVariant } from './types';

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
     * HTML Attribute: appearance
     */
    @attr
    public appearance: AnchorAppearance = AnchorAppearance.text;

    /**
     * @public
     * @remarks
     * HTML Attribute: appearance-variant
     */
    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: AnchorAppearanceVariant;

    /**
     * @public
     * @remarks
     * HTML Attribute: content-hidden
     */
    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;

    /**
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled = false;
}
applyMixins(Anchor, DelegatesARIALink);

const nimbleAnchor = Anchor.compose({
    baseName: 'anchor',
    baseClass: FoundationAnchor,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchor());
