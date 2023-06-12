import { html, ref, when } from '@microsoft/fast-element';

import type { TableColumnIconGroupHeaderView } from '.';

// prettier-ignore
export const template = html<TableColumnIconGroupHeaderView>`
    ${x => x.mappingToRender?.viewTemplate}
    <span
        ${ref('span')}
        @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.mappingToRender?.label && x.span!.offsetWidth < x.span!.scrollWidth;
    }}"
        @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
        title=${x => (x.isValidContentAndHasOverflow ? x.mappingToRender?.label : null)}
    >
        ${x => x.mappingToRender?.label}
    </span>
    ${when(x => x.mappingToRender === null, html<TableColumnIconGroupHeaderView>`${x => x.groupHeaderValue}`)}
`;
