import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties
} from '@microsoft/fast-foundation';
import { CSSResult, LitElement, TemplateResult } from 'lit';
import { styles } from './styles';
import { template } from './template';
import { BannerSeverityLit, BannerLitToggleEventDetail } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-banner-lit': BannerLit;
    }
}

/**
 * A nimble-styled notification banner for persistent messages.
 */
export class BannerLit extends LitElement {
    public static override styles: CSSResult = styles;
    protected override render(): TemplateResult {
        return template(this);
    }

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
    public severity: BannerSeverityLit = BannerSeverityLit.default;

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
        const eventDetail: BannerLitToggleEventDetail = {
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
export interface BannerLit extends ARIAGlobalStatesAndProperties {}
applyMixins(BannerLit, ARIAGlobalStatesAndProperties);

export const bannerLitTag = 'nimble-banner-lit';
