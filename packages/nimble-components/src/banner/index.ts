import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { BannerActionButtonAppearance, BannerType } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-banner': Banner;
    }
}

/**
 * A nimble-styled banner.
 */
export class Banner extends FoundationElement {
    @attr()
    public heading?: string;

    @attr()
    public type: BannerType = BannerType.default;

    @attr()
    public text?: string;

    @attr({ attribute: 'action-text' })
    public actionText?: string;

    @attr({ attribute: 'action-href' })
    public actionHref?: string;

    @attr({ attribute: 'action-button-appearance' })
    public actionButtonAppearance?: BannerActionButtonAppearance;

    /**
     * @public
     * @description
     * Hides the close button
     */
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    public closeBanner(): void {
        this.hidden = true;
    }
}

const nimbleBanner = Banner.compose({
    baseName: 'banner',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBanner());
