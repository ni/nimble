import { html, slotted, when } from '@ni/fast-element';
import type { TabsToolbar } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<TabsToolbar>`
    <template slot="end">
        ${when(x => x.slottedStartElements.length > 0, html`
            <div class="separator"></div>
        `)}
        <slot
            ${slotted({
                filter: (n: Node) => n instanceof HTMLElement,
                property: 'slottedStartElements',
            })}
        >
        </slot>
        <slot name="end">
        </slot>
    </template>
`;
