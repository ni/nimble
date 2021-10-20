import { html } from '@microsoft/fast-element';
import type { Icon } from '.';

export const template = html<Icon>`
    <template slot="start">
        <div class="icon" :innerHTML=${x => x.icon.data}></div>
    </template
`;
