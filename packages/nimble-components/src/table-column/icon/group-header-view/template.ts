import { html, when } from '@microsoft/fast-element';

import type { TableColumnIconGroupHeaderView } from '.';
import { spinnerTag } from '../../../spinner';

// prettier-ignore
export const template = html<TableColumnIconGroupHeaderView>`
    ${when(
        x => x.visual === 'icon',
        html<TableColumnIconGroupHeaderView>`${x => x.iconTemplate!}${x => x.label}`
    )}
    ${when(
        x => x.visual === 'spinner',
        html<TableColumnIconGroupHeaderView>`
        <${spinnerTag}
            title="${x => x.label}"
            aria-label="${x => x.label}">
        </${spinnerTag}>
        ${x => x.label}
    `
    )}
    ${when(
        x => x.visual === undefined,
        html<TableColumnIconGroupHeaderView>`${x => x.groupHeaderValue}`
    )}
`;
