import { html, when } from '@microsoft/fast-element';
import type { Banner } from '.';

export const template = html<Banner>`
    <div class="icon">
        ${when(x => x.type === 'error', html`<nimble-icon-exclamation-mark></nimble-icon-exclamation-mark>`)}
        ${when(x => x.type === 'warning', html`<nimble-icon-triangle-filled></nimble-icon-triangle-filled>`)}
        ${when(x => x.type === 'info', html`<nimble-icon-info></nimble-icon-info>`)}
    </div>
    <div class="text">
        ${when(x => x.heading, html<Banner>`
            <span class="heading">
                ${x => x.heading}
            </span>`)}
        ${x => x.text}
    </div>
    <div class="controls">
        ${when(x => x.actionText, html<Banner>`
            <div class="action">
                ${when(x => x.actionHref, html<Banner>`
                    <nimble-anchor href="${x => x.actionHref}">${x => x.actionText}</nimble-anchor>`)}
                ${when(x => !x.actionHref, html<Banner>`
                    <nimble-button appearance="${x => x.actionButtonAppearance}">${x => x.actionText}</nimble-button>`)}
            </div>`)}
        <div class="close">
            ${when(x => !x.preventDismiss, html`
                <nimble-button appearance="ghost" content-hidden @click="closeBanner()">
                    <nimble-icon-xmark slot="start"></nimble-icon-xmark>
                </nimble-button>`)}
        </div>
    </div>
`;
