import { html } from '@ni/fast-element';
import type { FvToolbar } from '.';

export const template = html<FvToolbar>`
    <div class="toolbar" part="toolbar">
        <div class="toolbar-primary" part="primary">
            <slot name="primary"></slot>
        </div>
        <div class="toolbar-end" part="end">
            <slot name="end"></slot>
        </div>
    </div>
`;