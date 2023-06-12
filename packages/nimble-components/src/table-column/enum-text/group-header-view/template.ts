import { html, when } from '@microsoft/fast-element';
import type { TableColumnEnumTextGroupHeaderView } from '.';
import { template as baseTemplate } from '../../text-base/group-header-view/template';

// The base template adds the mapped text value (with conditional tooltip), when a mapping is found.
// The group header never shows the placeholder text. Instead, when mappingToRender is null, the unmapped value
// (i.e. groupHeaderValue) is displayed.
// prettier-ignore
export const template = html<TableColumnEnumTextGroupHeaderView>`
    ${baseTemplate}
    ${when(x => x.mappingToRender === null, html<TableColumnEnumTextGroupHeaderView>`${x => x.groupHeaderValue}`)}
`;
