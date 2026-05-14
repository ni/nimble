import { html } from '@ni/fast-element';
import type { TsTableColumnBreakpoint } from '.';
import { template as baseTemplate } from '@ni/nimble-components/dist/esm/table-column/base/template';

export const template = html<TsTableColumnBreakpoint>`
    <template @delegated-event="${(x, c) => x.onDelegatedEvent(c.event)}"
        >${baseTemplate}</template
    >
`;
