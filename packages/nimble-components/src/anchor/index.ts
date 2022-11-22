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
            this.shadowRoot!.querySelector('.control')?.removeAttribute('disabled');
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        // Need to sync the <a>'s disabled attribute with the initial state of the host
        this.disabledChanged(undefined, this.disabled);
    }
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
