import { html } from '@ni/fast-element';
import { template as baseTemplate } from '@ni/nimble-components/dist/esm/table-column/base/template';
import type { TsTableColumnBreakpoint } from '.';

export const template = html<TsTableColumnBreakpoint>`
    <template @delegated-event="${(x, c) => x.onDelegatedEvent(c.event)}"
        >${baseTemplate}</template
    >
`;
