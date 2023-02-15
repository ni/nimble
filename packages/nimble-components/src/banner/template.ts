import { html, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Banner } from '.';
import { Button } from '../button';
import { IconExclamationMark } from '../icons/exclamation-mark';
import { IconInfo } from '../icons/info';
import { IconTriangleFilled } from '../icons/triangle-filled';
import { IconXmark } from '../icons/xmark';
import { BannerSeverity } from './types';

// prettier-ignore
export const template = html<Banner>`
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
            ${when(x => x.severity === BannerSeverity.error, html`
                <${DesignSystem.tagFor(IconExclamationMark)}></${DesignSystem.tagFor(IconExclamationMark)}>
            `)}
            ${when(x => x.severity === BannerSeverity.warning, html`
                <${DesignSystem.tagFor(IconTriangleFilled)}></${DesignSystem.tagFor(IconTriangleFilled)}>
            `)}
            ${when(x => x.severity === BannerSeverity.information, html`
                <${DesignSystem.tagFor(IconInfo)}></${DesignSystem.tagFor(IconInfo)}>
            `)}
        </div>
        <div class="text">
            <slot name="title" id="titleSlot"></slot>
            <slot></slot>
        </div>
        <div class="controls">
            <slot name="action"></slot>
            <div class="dismiss">
                ${when(x => !x.preventDismiss, html<Banner>`
                    <${DesignSystem.tagFor(Button)} appearance="ghost" content-hidden @click="${x => x.dismissBanner()}">
                        <${DesignSystem.tagFor(IconXmark)} slot="start"></${DesignSystem.tagFor(IconXmark)}>
                        ${x => x.dismissButtonLabel ?? 'Close'}
                    </${DesignSystem.tagFor(Button)}>
                `)}
            </div>
        </div>
    </div>
`;
