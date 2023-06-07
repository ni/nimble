import { html, ref, repeat, when } from '@microsoft/fast-element';

import type { ConvertedKeyMappingForIconColumn } from '../../../mapping/icon';
import type { TableColumnIconGroupHeaderView } from '.';

// prettier-ignore
export const template = html<TableColumnIconGroupHeaderView>`
    ${repeat(x => [x.getMappingToRender()], html<ConvertedKeyMappingForIconColumn>`${x => x?.viewTemplate}`)}
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
    ${when(x => x.getMappingToRender() == null, html<TableColumnIconGroupHeaderView>`${x => x.groupHeaderValue}`)}
`;
