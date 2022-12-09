import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor,
    AnchorOptions
} from '@microsoft/fast-foundation';
import {
    ButtonAppearance,
    ButtonAppearanceVariant,
    ButtonPattern,
    ButtonAppearanceVariantPattern
} from '../patterns/button/types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-button': AnchorButton;
    }
}

/**
 * A nimble-styled anchor button
 */
export class AnchorButton
    extends FoundationAnchor
    implements ButtonPattern, ButtonAppearanceVariantPattern {
    /**
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearance = ButtonAppearance.outline;

    /**
     * @public
     * @remarks
     * HTML Attribute: appearance-variant
     */
    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: ButtonAppearanceVariant;

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

const nimbleAnchorButton = AnchorButton.compose<AnchorOptions>({
    baseName: 'anchor-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorButton());
