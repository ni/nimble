import { html } from '@microsoft/fast-element';
import type { TableHeader } from '.';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader">
        <slot></slot>
    </template>
`;
