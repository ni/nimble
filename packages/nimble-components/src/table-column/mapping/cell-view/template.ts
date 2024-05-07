import { html, when } from '@microsoft/fast-element';
import type { TableColumnMappingCellView } from '.';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnMappingCellView>`
    ${when(
        x => x.visualizationTemplate,
        html<TableColumnMappingCellView>`
            <span class="reserve-icon-size">
                ${x => x.visualizationTemplate}
            </span>
        `
    )}
    ${when(x => !x.textHidden, html<TableColumnMappingCellView>`
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
            class="text"
        >
            ${x => x.text}
        </span>
    `)}
`;
