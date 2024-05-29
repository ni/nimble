import { html, when } from '@microsoft/fast-element';
import type { BannerLit } from '.';
import { buttonTag } from '../button';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { iconInfoTag } from '../icons/info';
import { iconTriangleFilledTag } from '../icons/triangle-filled';
import { iconTimesTag } from '../icons/times';
import { BannerSeverityLit } from './types';
import {
    popupIconErrorLabel,
    popupIconInformationLabel,
    popupDismissLabel,
    popupIconWarningLabel
} from '../label-provider/core/label-tokens';
import { themeProviderTag } from '../theme-provider';
import { Theme } from '../theme-provider/types';
import { ButtonAppearance, ButtonAppearanceVariant } from '../button/types';

// prettier-ignore
export const template = html<BannerLit>`
    <${themeProviderTag} theme="${Theme.color}">
        <div class="container"
            role="status"
            aria-atomic="${x => x.ariaAtomic}"
            aria-busy="${x => x.ariaBusy}"
            aria-controls="${x => x.ariaControls}"
            aria-current="${x => x.ariaCurrent}"
            aria-describedby="${x => x.ariaDescribedby}"
            aria-details="${x => x.ariaDetails}"
            aria-disabled="${x => x.ariaDisabled}"
            aria-errormessage="${x => x.ariaErrormessage}"
            aria-expanded="${x => x.ariaExpanded}"
            aria-flowto="${x => x.ariaFlowto}"
            aria-haspopup="${x => x.ariaHaspopup}"
            aria-hidden="${x => x.ariaHidden}"
            aria-invalid="${x => x.ariaInvalid}"
            aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
            aria-label="${x => x.ariaLabel}"
            aria-labelledby="titleSlot"
            aria-live="${x => x.ariaLive}"
            aria-owns="${x => x.ariaOwns}"
            aria-relevant="${x => x.ariaRelevant}"
            aria-roledescription="${x => x.ariaRoledescription}"
        >
            <div class="icon">
                ${when(x => x.severity === BannerSeverityLit.error, html<BannerLit>`
                    <${iconExclamationMarkTag} role="img" aria-label="${x => popupIconErrorLabel.getValueFor(x)}"></${iconExclamationMarkTag}>
                `)}
                ${when(x => x.severity === BannerSeverityLit.warning, html<BannerLit>`
                    <${iconTriangleFilledTag} role="img" aria-label="${x => popupIconWarningLabel.getValueFor(x)}"></${iconTriangleFilledTag}>
                `)}
                ${when(x => x.severity === BannerSeverityLit.information, html<BannerLit>`
                    <${iconInfoTag} role="img" aria-label="${x => popupIconInformationLabel.getValueFor(x)}"></${iconInfoTag}>
                `)}
            </div>
            <div class="text">
                <slot name="title" id="titleSlot"></slot>
                <slot></slot>
            </div>
            <div class="controls">
                <slot name="action"></slot>
                <div class="dismiss">
                    ${when(x => !x.preventDismiss, html<BannerLit>`
                        <${buttonTag} appearance="${ButtonAppearance.ghost}" appearance-variant="${ButtonAppearanceVariant.primary}" content-hidden @click="${x => x.dismissBanner()}">
                            <${iconTimesTag} slot="start"></${iconTimesTag}>
                            ${x => popupDismissLabel.getValueFor(x)}
                        </${buttonTag}>
                    `)}
                </div>
            </div>
        </div>
    </${themeProviderTag}>
`;
