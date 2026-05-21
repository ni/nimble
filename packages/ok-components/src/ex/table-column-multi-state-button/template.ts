import { html } from '@ni/fast-element';
import type { ExTableColumnMultiStateButton } from '.';
import { template as baseTemplate } from '@ni/nimble-components/dist/esm/table-column/base/template';

export const template = html<ExTableColumnMultiStateButton>`
    <template @delegated-event="${(x, c) => x.onDelegatedEvent(c.event)}"
        >${baseTemplate}</template
    >
`;
