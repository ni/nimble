import { html } from '@microsoft/fast-element';
import type { TableHeader } from '.';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader">
        <div class="separator"></div>
        <div class="content">
            <slot></slot>
        </div>
        <div class="separator"></div>
    </template>
`;
