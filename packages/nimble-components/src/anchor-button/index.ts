import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor,
    anchorTemplate as template,
    applyMixins,
    DelegatesARIALink
} from '@microsoft/fast-foundation';
import {
    ButtonAppearance,
    ButtonAppearanceVariant,
    ButtonPattern,
    ButtonWithAppearanceVariantPattern
} from '../patterns/button/types';
import { styles } from './styles';

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
    implements ButtonPattern, ButtonWithAppearanceVariantPattern {
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

    /**
     * The <a> element (".control") in the shadow root is not automatically
     * disabled when the host is. It does not support the disabled attribute.
     * When the host is disabled, we must manually remove the <a> element from
     * the tab order. We must also sync its disabled attribute with the host,
     * because the shared button CSS expects the element with class "control"
     * to get the disabled attribute when the host has it.
     */
    public disabledChanged(_prev: boolean | undefined, next: boolean): void {
        if (next) {
            this.tabIndex = -1;
            const control = this.shadowRoot!.querySelector('.control');
            control?.setAttribute('disabled', '');
        } else {
            this.tabIndex = 0;
            this.shadowRoot!.querySelector('.control')?.removeAttribute(
                'disabled'
            );
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        // Need to sync the <a>'s disabled attribute with the initial state of the host
        this.disabledChanged(undefined, this.disabled);
    }
}
applyMixins(AnchorButton, DelegatesARIALink);

const nimbleAnchorButton = AnchorButton.compose({
    baseName: 'anchor-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorButton());
