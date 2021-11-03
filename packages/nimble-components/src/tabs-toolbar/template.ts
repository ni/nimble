import { html } from '@microsoft/fast-element';

export const template = html`
    <template slot="end">
        <div class="separator"></div>
        <slot></slot>
    </template>
`;
