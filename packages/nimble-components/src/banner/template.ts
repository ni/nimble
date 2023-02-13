import { html, slotted, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Banner } from '.';
import { Button } from '../button';
import { IconExclamationMark } from '../icons/exclamation-mark';
import { IconInfo } from '../icons/info';
import { IconTriangleFilled } from '../icons/triangle-filled';
import { IconXmark } from '../icons/xmark';

// prettier-ignore
export const template = html<Banner>`
    <template role="status" aria-label=${x => x.getAriaLabel()}>
        <div class="container">
            <div class="icon">
                ${when(x => x.severity === 'error', html`
                    <${DesignSystem.tagFor(IconExclamationMark)}></${DesignSystem.tagFor(IconExclamationMark)}>
                `)}
                ${when(x => x.severity === 'warning', html`
                    <${DesignSystem.tagFor(IconTriangleFilled)}></${DesignSystem.tagFor(IconTriangleFilled)}>
                `)}
                ${when(x => x.severity === 'info', html`
                    <${DesignSystem.tagFor(IconInfo)}></${DesignSystem.tagFor(IconInfo)}>
                `)}
            </div>
            <div class="text">
                <slot name="title" ${slotted('slottedTitle')}></slot>
                <slot></slot>
            </div>
            <div class="controls">
                <slot name="action"></slot>
                <div class="dismiss">
                    ${when(x => !x.preventDismiss, html<Banner>`
                        <${DesignSystem.tagFor(Button)} appearance="ghost" content-hidden @click="${x => x.dismissBanner()}">
                            <${DesignSystem.tagFor(IconXmark)} slot="start"></${DesignSystem.tagFor(IconXmark)}>
                            ${x => x.dismissButtonLabel}
                        </${DesignSystem.tagFor(Button)}>
                    `)}
                </div>
            </div>
        </div>
    </template>
`;
