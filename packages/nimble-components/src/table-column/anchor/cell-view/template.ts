import { html, ref, when } from '@microsoft/fast-element';
import type { TableColumnAnchorCellView } from '.';
import { anchorTag } from '../../../anchor';

export const template = html<TableColumnAnchorCellView>`
    ${when(
        x => typeof x.cellRecord.href === 'string',
        html<TableColumnAnchorCellView>` <${anchorTag}
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
            appearance="${x => x.columnConfig.appearance}"
            title=${x => (x.isValidContentAndHasOverflow ? x.content : null)}
            @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.content
                    && x.anchor!.offsetWidth < x.anchor!.scrollWidth;
    }}"
            @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
        >
            ${x => x.content}
        </${anchorTag}>`
    )}
    ${when(
        x => typeof x.cellRecord.href !== 'string',
        html<TableColumnAnchorCellView>` <span
            ${ref('textSpan')}
            class="${x => (typeof x.cellRecord.label === 'string' ? '' : 'placeholder')}"
            title=${x => (x.isValidContentAndHasOverflow ? x.content : null)}
            @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.content
                    && x.textSpan!.offsetWidth < x.textSpan!.scrollWidth;
    }}"
            @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
        >
            ${x => x.content}
        </span>`
    )}
`;
