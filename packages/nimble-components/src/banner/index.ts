import { attr } from '@ni/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { BannerSeverity, type BannerToggleEventDetail } from './types';

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
     * @internal
     */
    public openChanged(): void {
        const eventDetail: BannerToggleEventDetail = {
            newState: this.open,
            oldState: !this.open
        };
        this.$emit('toggle', eventDetail);
    }

    /**
     * @internal
     */
    public dismissBanner(): void {
        this.open = false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Banner extends ARIAGlobalStatesAndProperties {}
applyMixins(Banner, ARIAGlobalStatesAndProperties);

const nimbleBanner = Banner.compose({
    baseName: 'banner',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBanner());
export const bannerTag = 'nimble-banner';
