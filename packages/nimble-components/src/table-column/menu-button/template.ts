import { html } from '@ni/fast-element';
import type { TableColumnMenuButton } from '.';
import { template as baseTemplate } from '../base/template';

export const template = html<TableColumnMenuButton>`
    <template @delegated-event="${(x, c) => x.onDelegatedEvent(c.event)}"
        >${baseTemplate}</template
    >
`;
