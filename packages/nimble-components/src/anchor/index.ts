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

    private cachedTabIndex: number | undefined;

    /**
     * The <a> element (".control") in the shadow root is not automatically
     * disabled when the host is. It does not support the disabled attribute.
     * When the host is disabled, we must manually remove it from the tab order.
     */
    public disabledChanged(_prev: boolean | undefined, next: boolean): void {
        // This will get called in the constructor upon initialization.
        // An exception is thrown if we try to set tabIndex in the constructor,
        // so we skip setting it unless connected.
        if (this.isConnected) {
            if (next) {
                this.cachedTabIndex = this.tabIndex;
                this.tabIndex = -1;
            } else if (this.cachedTabIndex !== undefined) {
                this.tabIndex = this.cachedTabIndex!;
                this.cachedTabIndex = undefined;
            }
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        // Need to sync the tabIndex value with the initial disabled state
        this.disabledChanged(undefined, this.disabled);
    }
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
