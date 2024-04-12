import { html, when } from '@microsoft/fast-element';
import type { TableColumnIconCellView } from '.';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnIconCellView>`
    ${when(
        x => x.visualizationTemplate,
        html<TableColumnIconCellView>`
            <span class="reserve-icon-size">
                ${x => x.visualizationTemplate!}
            </span>
        `
    )}
    ${when(x => !x.textHidden, html<TableColumnIconCellView>`
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
            class="text"
        >
            ${x => x.text}
        </span>
    `)}
`;
