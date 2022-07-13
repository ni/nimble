import { html, ref, ViewTemplate, when } from '@microsoft/fast-element';
import { AnchoredRegion, FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { Tooltip } from '.';

export const template: FoundationElementTemplate<ViewTemplate<Tooltip>> = context => {
    return html<Tooltip>`
        ${when(
        x => x.tooltipVisible,
        html<Tooltip>`
            <${context.tagFor(AnchoredRegion)}
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
                    <nimble-icon-exclamation-mark class="fail"></nimble-icon-exclamation-mark>
                    <nimble-icon-info class="information"></nimble-icon-info>
                    <slot></slot>
                </div>
            </${context.tagFor(AnchoredRegion)}>
        `
    )}
    `;
};