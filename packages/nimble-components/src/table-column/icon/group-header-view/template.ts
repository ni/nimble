import { html, when } from '@microsoft/fast-element';

import type { TableColumnIconGroupHeaderView } from '.';
import { spinnerTag } from '../../../spinner';

// prettier-ignore
export const template = html<TableColumnIconGroupHeaderView>`
    ${when(
        x => x.visual === 'icon',
        x => x.iconTemplate!
    )}
    ${when(
        x => x.visual === 'spinner',
        html<TableColumnIconGroupHeaderView>`
        <${spinnerTag}
            title="${x => x.label}"
            aria-label="${x => x.label}">
        </${spinnerTag}>
    `
    )}
    ${when(
        x => x.visual === undefined,
        html<TableColumnIconGroupHeaderView>`${x => x.groupHeaderValue}`
    )}
`;
