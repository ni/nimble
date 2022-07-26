import { html, ref, ViewTemplate, when } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import { AnchoredRegion } from '../anchored-region';
import { IconExclamationMark } from '../icons/exclamation-mark';
import { IconInfo } from '../icons/info';
import type { Tooltip } from '.';

// prettier-ignore
export const template: FoundationElementTemplate<ViewTemplate<Tooltip>> = context => {
    return html<Tooltip>`
            ${when(
        x => x.tooltipVisible,
        html<Tooltip>`
            <${context.tagFor(AnchoredRegion)}
                class="anchored-region"
                fixed-placement="true"
                auto-update-mode="${x => x.autoUpdateMode}"
                vertical-positioning-mode="${x => x.verticalPositioningMode}"
                vertical-default-position="${x => x.verticalDefaultPosition}"
                vertical-inset="${x => x.verticalInset}"
                vertical-scaling="${x => x.verticalScaling}"
                horizontal-positioning-mode="${x => x.horizontalPositioningMode}"
                horizontal-default-position="${x => x.horizontalDefaultPosition}"
                horizontal-scaling="${x => x.horizontalScaling}"
                horizontal-inset="${x => x.horizontalInset}"
                vertical-viewport-lock="${x => x.horizontalViewportLock}"
                horizontal-viewport-lock="${x => x.verticalViewportLock}"
                dir="${x => x.currentDirection}"
                ${ref('region')}
            >
                <div class="tooltip" part="tooltip" role="tooltip">
                    <${context.tagFor(IconExclamationMark)} class="fail status-icon"></${context.tagFor(IconExclamationMark)}>
                    <${context.tagFor(IconInfo)} class="information status-icon"></${context.tagFor(IconInfo)}>
                    <slot></slot>
                </div>
            </${context.tagFor(AnchoredRegion)}>
        `
    )}
        `;
};
