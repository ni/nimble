import { html, when } from '@microsoft/fast-element';
import type { TableColumnIconCellView } from '.';
import { spinnerTag } from '../../../spinner';

export const template = html<TableColumnIconCellView>`
    ${when(
        x => x.iconTemplate,
        x => x.iconTemplate!
    )}
    ${when(
        x => !x.iconTemplate,
        html<TableColumnIconCellView>`
        <${spinnerTag}
            title="${x => x.text}"
            aria-label="${x => x.text}"
            class="no-shrink">
        </${spinnerTag}>
    `
    )}
`;
