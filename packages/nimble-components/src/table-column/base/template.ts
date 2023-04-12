import { html } from '@microsoft/fast-element';
import type { TableColumn } from '.';

export const template = html<TableColumn>`
    <template>
        <span class="header-content" title="${x => x.textContent}">
            <slot></slot>
        </span>
    </template>
`;
