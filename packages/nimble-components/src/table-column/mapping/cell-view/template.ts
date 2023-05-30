import { html, repeat } from '@microsoft/fast-element';

import type { TableColumnMappingCellView } from '.';
import type { Mapping } from '../mappings';

// prettier-ignore
export const template = html<TableColumnMappingCellView>`
    ${repeat(x => [x.getMappingToRender()], html<Mapping>`${x => x?.cellViewTemplate}`)}
`;
