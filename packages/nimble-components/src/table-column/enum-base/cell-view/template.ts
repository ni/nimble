import { html, repeat } from '@microsoft/fast-element';

import type { TableColumnEnumCellView } from '.';
import type { Mapping } from '../../../mapping/base';

// prettier-ignore
export const template = html<TableColumnEnumCellView>`
    ${repeat(x => [x.getMappingToRender()], html<Mapping>`${x => x?.cellViewTemplate}`)}
`;
