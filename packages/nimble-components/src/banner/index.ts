/* eslint-disable max-classes-per-file */
import { attr, customElement } from '@ni/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    FoundationElement
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { BannerSeverity, type BannerToggleEventDetail } from './types';

export const bannerTag = 'nimble-banner';

declare global {
    interface HTMLElementTagNameMap {
        [bannerTag]: Banner;
    }
}

/**
 * Banner Mixins Helper
 */
class BannerMixins extends FoundationElement {}
applyMixins(BannerMixins, ARIAGlobalStatesAndProperties);
interface BannerMixins
    extends ARIAGlobalStatesAndProperties,
    FoundationElement {}

/**
 * A nimble-styled notification banner for persistent messages.
 */
@customElement({
    name: bannerTag,
    template,
    styles
})
export class Banner extends BannerMixins {
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
