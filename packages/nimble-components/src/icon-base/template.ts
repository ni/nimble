import { html } from '@microsoft/fast-element';
import type { Icon } from '.';

export const template = html<Icon>`
    <template>
        <div class="icon" aria-hidden="true" :innerHTML=${x => x.icon.data}></div>
    </template
`;
