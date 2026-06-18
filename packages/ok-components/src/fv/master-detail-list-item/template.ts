import { html, when } from '@ni/fast-element';
import { iconCircleFilledTag } from '@ni/nimble-components/dist/esm/icons/circle-filled';
import type { FvMasterDetailListItem } from '.';

export const template = html<FvMasterDetailListItem>`
    <div class="item" part="item">
        <div class="text" part="text">
            <div class="title" part="title">${x => x.titleText}</div>
            <div class="subtitle" part="subtitle">${x => x.subtitle}</div>
        </div>
        <div class="status" part="status" ?hidden="${x => !x.hasStatus}">
            <slot
                name="status"
                @slotchange="${(x, c) => {
                    x.handleStatusSlotChange(c.event);
                    return true;
                }}"
            >
                ${when(
                    x => x.statusColor.trim().length > 0,
                    html<FvMasterDetailListItem>`
                        <${iconCircleFilledTag}
                            class="status-icon"
                            part="status-icon"
                            role="${x => (x.fallbackStatusLabel ? 'img' : null)}"
                            aria-label="${x => x.fallbackStatusLabel}"
                            aria-hidden="${x => (x.fallbackStatusLabel === null ? 'true' : null)}"
                            style="${x => `color: ${x.statusColor};`}"
                        ></${iconCircleFilledTag}>
                    `
                )}
            </slot>
        </div>
    </div>
`;