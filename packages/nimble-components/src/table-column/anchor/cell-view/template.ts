import { html, ref, when } from '@microsoft/fast-element';
import type { TableColumnAnchorCellView } from '.';

export const template = html<TableColumnAnchorCellView>`
    ${when(x => typeof x.cellRecord.href === 'string', html<TableColumnAnchorCellView>`
    <nimble-anchor
        ${ref('anchor')}
        href="${x => x.cellRecord.href}"
        hreflang="${x => x.columnConfig.hreflang}"
        ping="${x => x.columnConfig.ping}"
        referrerpolicy="${x => x.columnConfig.referrerpolicy}"
        rel="${x => x.columnConfig.rel}"
        target="${x => x.columnConfig.target}"
        type="${x => x.columnConfig.type}"
        download="${x => x.columnConfig.download}"
        underline-hidden
        @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.content && x.anchor!.offsetWidth < x.anchor!.scrollWidth;
    }}"
        @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
    >
        ${x => x.content}
    </nimble-anchor>`)}
    ${when(x => typeof x.cellRecord.href !== 'string', html<TableColumnAnchorCellView>`
    <span
        class="${x => (typeof x.cellRecord.label === 'string' ? '' : 'placeholder')}"
        @mouseover="${(x, c) => {
        const span = c.event.target as HTMLElement;
        x.isValidContentAndHasOverflow = !!x.content && span.offsetWidth < span.scrollWidth;
    }}"
        @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
    >
        ${x => x.content}
    </span>`)}
`;
