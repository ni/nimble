import { html, repeat } from '@microsoft/fast-element';

import type { TableColumnEnumCellView } from '.';
import type { ConvertedKeyMapping } from '..';

// prettier-ignore
export const template = html<TableColumnEnumCellView>`
    ${repeat(x => [x.getMappingToRender()], html<ConvertedKeyMapping>`${x => x?.cellViewTemplate}`)}
`;
