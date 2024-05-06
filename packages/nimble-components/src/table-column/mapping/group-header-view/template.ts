import { html, when } from '@microsoft/fast-element';

import type { TableColumnMappingGroupHeaderView } from '.';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnMappingGroupHeaderView>`
    ${when(
        x => x.visualizationTemplate,
        html<TableColumnMappingGroupHeaderView>`
            <span class="reserve-icon-size">
                ${x => x.visualizationTemplate}
            </span>
        `
    )}
    <span
        ${overflow('hasOverflow')}
        title="${x => (x.hasOverflow && x.text ? x.text : null)}"
        class="text"
    >${x => x.text}</span>
`;
