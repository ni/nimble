import { html, when } from '@microsoft/fast-element';
import type { TableColumnIconCellView } from '.';
import { spinnerTag } from '../../../spinner';

export const template = html<TableColumnIconCellView>`
    ${when(
        x => x.visual === 'icon',
        x => x.iconTemplate!
    )}
    ${when(
        x => x.visual === 'spinner',
        html<TableColumnIconCellView>`
        <${spinnerTag}
            title="${x => x.text}"
            aria-label="${x => x.text}"
            class="no-shrink">
        </${spinnerTag}>
    `
    )}
`;
