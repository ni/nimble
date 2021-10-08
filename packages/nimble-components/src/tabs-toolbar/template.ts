import { html } from '@microsoft/fast-element';

export const template = html`
    <template slot="toolbar">
        <div class="separator"></div>
        <slot></slot>
    </template>
`;
