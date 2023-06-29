import { html } from '@microsoft/fast-element';

import type { TableColumnIconCellView } from '.';

export const template = html<TableColumnIconCellView>`
    ${x => x.mappingToRender?.viewTemplate}
`;
