import {
    applyMixins,
    ARIAGlobalStatesAndProperties
} from '@microsoft/fast-foundation';
import { CSSResult, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { property } from 'lit/decorators.js';
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

    /**
     * @public
     * @description
     * Whether the banner is visible or not
     */
    @property({ type: Boolean })
    public open = false;

    /**
     * @public
     * @description
     * Severity of the banner's message
     */
    @property()
    public severity: BannerSeverityLit = BannerSeverityLit.default;

    /**
     * @public
     * @description
     * Whether the banner title is hidden
     */
    @property({ attribute: 'title-hidden', type: Boolean })
    public titleHidden = false;

    /**
     * @public
     * @description
     * Hides the dismiss button
     */
    @property({ attribute: 'prevent-dismiss', type: Boolean })
    public preventDismiss = false;

    /**
     * @internal
     */
    public openChanged(): void {
        const eventDetail: BannerLitToggleEventDetail = {
            newState: this.open,
            oldState: !this.open
        };
        const litEventDetail = {
            detail: eventDetail
        };
        this.dispatchEvent(new CustomEvent('toggle', litEventDetail));
    }

    /**
     * @internal
     */
    public dismissBanner(): void {
        this.open = false;
    }

    protected override render(): TemplateResult {
        return template(this);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BannerLit extends ARIAGlobalStatesAndProperties {}
applyMixins(BannerLit, ARIAGlobalStatesAndProperties);

export const bannerLitTag = 'nimble-banner-lit';
