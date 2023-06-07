import { html, ref } from '@microsoft/fast-element';
import type { TableColumnEnumTextCellView } from '.';

// prettier-ignore
export const template = html<TableColumnEnumTextCellView>`
    <span
        ${ref('span')}
        @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.getMappingToRender()?.label && x.span!.offsetWidth < x.span!.scrollWidth;
    }}"
        @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
        title=${x => (x.isValidContentAndHasOverflow ? x.getMappingToRender()?.label : null)}
    >
        ${x => x.getMappingToRender()?.label}
    </span>
`;
