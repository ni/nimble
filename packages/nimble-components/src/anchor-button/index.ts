import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor,
    anchorTemplate as template,
    applyMixins,
    DelegatesARIALink,
    AnchorOptions
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

    private cachedTabIndex: number | undefined;

    /**
     * The <a> element (".control") in the shadow root is not automatically
     * disabled when the host is. It does not support the disabled attribute.
     * When the host is disabled, we must manually remove it from the tab order.
     * We must also sync its disabled attribute with the host, because the
     * shared button CSS expects the element with class "control" to get the
     * disabled attribute when the host has it.
     */
    public disabledChanged(_prev: boolean | undefined, next: boolean): void {
        // This will get called in the constructor upon initialization.
        // An exception is thrown if we try to set tabIndex in the constructor,
        // so we skip setting it unless connected.
        if (this.isConnected) {
            if (next) {
                this.cachedTabIndex = this.tabIndex;
                this.tabIndex = -1;
                const control = this.shadowRoot!.querySelector('.control');
                control?.setAttribute('disabled', '');
            } else if (this.cachedTabIndex !== undefined) {
                this.tabIndex = this.cachedTabIndex!;
                this.cachedTabIndex = undefined;
                this.shadowRoot!.querySelector('.control')?.removeAttribute(
                    'disabled'
                );
            }
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        // Need to sync the tabIndex and <a>'s disabled
        // attribute with the initial state of the host
        this.disabledChanged(undefined, this.disabled);
    }
}
applyMixins(AnchorButton, DelegatesARIALink);

const nimbleAnchorButton = AnchorButton.compose<AnchorOptions>({
    baseName: 'anchor-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorButton());
