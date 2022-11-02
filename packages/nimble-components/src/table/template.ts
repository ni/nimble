import { html, ref, slotted } from '@microsoft/fast-element';
import type { Table } from '.';

export const template = html<Table>`
    <template>
        <perspective-viewer ${ref('viewer')}></perspective-viewer>
        <slot ${slotted('slottedColumns')}></slot>
    </template>
`;
