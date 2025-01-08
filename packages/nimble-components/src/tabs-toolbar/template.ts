import { html } from '@ni/fast-element';
import type { TabsToolbar } from '.';

export const template = html<TabsToolbar>`
    <template slot="end">
        <div class="separator"></div>
        <slot></slot>
    </template>
`;
