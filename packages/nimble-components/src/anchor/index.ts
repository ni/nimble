import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor,
    anchorTemplate as template,
    applyMixins,
    DelegatesARIALink
} from '@microsoft/fast-foundation';
import { styles } from './styles';

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
     * HTML Attribute: inline
     */
    @attr({ mode: 'boolean' })
    public inline = false;

    /**
     * @public
     * @remarks
     * HTML Attribute: prominent
     */
    @attr({ mode: 'boolean' })
    public prominent = false;

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
     * the tab order.
     */
    public disabledChanged(_prev: boolean | undefined, next: boolean): void {
        if (next) {
            this.tabIndex = -1;
        } else {
            this.tabIndex = 0;
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
