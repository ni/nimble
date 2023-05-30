import { html, repeat, when } from '@microsoft/fast-element';

import type { TableColumnMappingGroupHeaderView } from '.';
import type { Mapping } from '../mappings';

// prettier-ignore
export const template = html<TableColumnMappingGroupHeaderView>`
    ${repeat(x => [x.getMappingToRender()], html<Mapping>`${x => x.groupHeaderViewTemplate}`)}
    ${when(x => x.getMappingToRender() == null, html<TableColumnMappingGroupHeaderView>`${x => x.groupHeaderValue}`)}
`;
