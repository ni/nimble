import { html, repeat } from '@microsoft/fast-element';

import type { TableColumnIconCellView } from '.';
import type { ConvertedKeyMappingForIconColumn } from '../../../mapping/icon';

// prettier-ignore
export const template = html<TableColumnIconCellView>`
    ${repeat(x => [x.getMappingToRender()], html<ConvertedKeyMappingForIconColumn>`${x => x?.viewTemplate}`)}
`;
