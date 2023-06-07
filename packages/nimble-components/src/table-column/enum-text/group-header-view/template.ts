import { html, ref, when } from '@microsoft/fast-element';

import type { TableColumnEnumTextGroupHeaderView } from '.';

// prettier-ignore
export const template = html<TableColumnEnumTextGroupHeaderView>`
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
    ${when(x => x.getMappingToRender() == null, html<TableColumnEnumTextGroupHeaderView>`${x => x.groupHeaderValue}`)}
`;
