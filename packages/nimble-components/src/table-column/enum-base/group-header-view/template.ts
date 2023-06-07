import { html, repeat, when } from '@microsoft/fast-element';

import type { TableColumnEnumGroupHeaderView } from '.';
import type { ConvertedKeyMapping } from '..';

// prettier-ignore
export const template = html<TableColumnEnumGroupHeaderView>`
    ${repeat(x => [x.getMappingToRender()], html<ConvertedKeyMapping>`${x => x?.groupHeaderViewTemplate}`)}
    ${when(x => x.getMappingToRender() == null, html<TableColumnEnumGroupHeaderView>`${x => x.groupHeaderValue}`)}
`;
