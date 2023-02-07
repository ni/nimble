import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { BannerSeverity } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-banner': Banner;
    }
}

/**
 * A nimble-styled notification banner for persistent messages.
 */
export class Banner extends FoundationElement {
    /**
     * @public
     * @description
     * Whether the banner is visible or not
     */
    @attr({ mode: 'boolean' })
    public open = false;

    /**
     * @public
     * @description
     * Severity of the banner's message
     */
    @attr()
    public severity: BannerSeverity = BannerSeverity.default;

    /**
     * @public
     * @description
     * Whether the banner title is hidden
     */
    @attr({ attribute: 'title-hidden', mode: 'boolean' })
    public titleHidden = false;

    /**
     * @public
     * @description
     * Hides the dismiss button
     */
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    /**
     * @public
     * @description
     * Label (not visible) for the dismiss button
     */
    @attr({ attribute: 'dismiss-button-label' })
    public dismissButtonLabel?: string;

    /**
     * @internal
     */
    public openChanged(): void {
        this.$emit('toggle', { oldState: !this.open, newState: this.open });
    }

    /**
     * @internal
     */
    public closeBanner(): void {
        this.open = false;
    }
}

const nimbleBanner = Banner.compose({
    baseName: 'banner',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBanner());
