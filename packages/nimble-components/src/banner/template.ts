import { html, when } from '@microsoft/fast-element';
import type { Banner } from '.';
import { buttonTag } from '../button';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { iconInfoTag } from '../icons/info';
import { iconTriangleFilledTag } from '../icons/triangle-filled';
import { iconXmarkTag } from '../icons/xmark';
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
                <${iconExclamationMarkTag}></${iconExclamationMarkTag}>
            `)}
            ${when(x => x.severity === BannerSeverity.warning, html`
                <${iconTriangleFilledTag}></${iconTriangleFilledTag}>
            `)}
            ${when(x => x.severity === BannerSeverity.information, html`
                <${iconInfoTag}></${iconInfoTag}>
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
                    <${buttonTag} appearance="ghost" content-hidden @click="${x => x.dismissBanner()}">
                        <${iconXmarkTag} slot="start"></${iconXmarkTag}>
                        ${x => x.dismissButtonLabel ?? 'Close'}
                    </${buttonTag}>
                `)}
            </div>
        </div>
    </div>
`;
