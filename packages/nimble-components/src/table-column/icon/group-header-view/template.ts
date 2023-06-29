import { html } from '@microsoft/fast-element';
import { template as baseTemplate } from '../../text-base/group-header-view/template';

import type { TableColumnIconGroupHeaderView } from '.';

// prettier-ignore
export const template = html<TableColumnIconGroupHeaderView>`
    ${x => x.mappingToRender}
    ${baseTemplate}
`;
