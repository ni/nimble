import { html, when } from '@microsoft/fast-element';
import type { TableColumnEnumTextGroupHeaderView } from '.';
import { template as baseTemplate } from '../../text-base/group-header-view/template';

// prettier-ignore
export const template = html<TableColumnEnumTextGroupHeaderView>`
    ${baseTemplate}
    ${when(x => x.getMappingToRender() == null, html<TableColumnEnumTextGroupHeaderView>`${x => x.groupHeaderValue}`)}
`;
