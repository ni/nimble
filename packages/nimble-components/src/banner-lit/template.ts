import { TemplateResult, html } from 'lit';
// eslint-disable-next-line import/extensions
import { when } from 'lit/directives/when.js';
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
export const template = (x: BannerLit): TemplateResult => html`
    <${themeProviderTag} theme="${Theme.color}">
        <div class="container"
            role="status"
            aria-atomic="${x.ariaAtomic}"
            aria-busy="${x.ariaBusy}"
            aria-controls="${x.ariaControls}"
            aria-current="${x.ariaCurrent}"
            aria-describedby="${x.ariaDescribedby}"
            aria-details="${x.ariaDetails}"
            aria-disabled="${x.ariaDisabled}"
            aria-errormessage="${x.ariaErrormessage}"
            aria-expanded="${x.ariaExpanded}"
            aria-flowto="${x.ariaFlowto}"
            aria-haspopup="${x.ariaHaspopup}"
            aria-hidden="${x.ariaHidden}"
            aria-invalid="${x.ariaInvalid}"
            aria-keyshortcuts="${x.ariaKeyshortcuts}"
            aria-label="${x.ariaLabel}"
            aria-labelledby="titleSlot"
            aria-live="${x.ariaLive}"
            aria-owns="${x.ariaOwns}"
            aria-relevant="${x.ariaRelevant}"
            aria-roledescription="${x.ariaRoledescription}"
        >
            <div class="icon">
                ${when(x.severity === BannerSeverityLit.error, () => html`
                    <${iconExclamationMarkTag} role="img" aria-label="${popupIconErrorLabel.getValueFor(x)}"></${iconExclamationMarkTag}>
                `)}
                ${when(x.severity === BannerSeverityLit.warning, () => html`
                    <${iconTriangleFilledTag} role="img" aria-label="${popupIconWarningLabel.getValueFor(x)}"></${iconTriangleFilledTag}>
                `)}
                ${when(x.severity === BannerSeverityLit.information, () => html`
                    <${iconInfoTag} role="img" aria-label="${popupIconInformationLabel.getValueFor(x)}"></${iconInfoTag}>
                `)}
            </div>
            <div class="text">
                <slot name="title" id="titleSlot"></slot>
                <slot></slot>
            </div>
            <div class="controls">
                <slot name="action"></slot>
                <div class="dismiss">
                    ${when(!x.preventDismiss, () => html`
                        <${buttonTag} appearance="${ButtonAppearance.ghost}" appearance-variant="${ButtonAppearanceVariant.primary}" content-hidden @click="${x.dismissBanner}">
                            <${iconTimesTag} slot="start"></${iconTimesTag}>
                            ${popupDismissLabel.getValueFor(x)}
                        </${buttonTag}>
                    `)}
                </div>
            </div>
        </div>
    </${themeProviderTag}>
`;
