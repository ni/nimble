import { html, ref } from '@ni/fast-element';
import type { FvStickyHeader } from '.';

export const template = html<FvStickyHeader>`
    <div class="header" part="header">
        <slot
            name="header"
            ${ref('headerSlot')}
            @slotchange="${x => x.handleHeaderSlotChange()}"
        ></slot>
    </div>
    <div
        class="sticky-header"
        part="sticky-header"
        ?hidden="${x => !x.showStickyHeader}"
    >
        <slot
            name="sticky-header"
            ${ref('stickyHeaderSlot')}
            @slotchange="${(x, c) => x.handleStickyHeaderSlotChange(c.event)}"
        ></slot>
    </div>
`;
