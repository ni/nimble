import { html } from '@microsoft/fast-element';
import type { ListOptionGroup } from '.';

// prettier-ignore
export const template = html<ListOptionGroup>`
    <template
    >
        <div class="label">
            ${x => x.label}
        </div>
        <span class="content" part="content">
            <slot></slot>
        </span>
    </template>

`;
