import { html, slotted, ViewTemplate, when } from '@ni/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    type FoundationElementDefinition,
    type FoundationElementTemplate,
    type StartEndOptions
} from '@ni/fast-foundation';
import type { TabsToolbar } from '.';

type TabsToolbarOptions = FoundationElementDefinition & StartEndOptions;

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template: FoundationElementTemplate<
    ViewTemplate<TabsToolbar>,
    TabsToolbarOptions
> = (context, definition) => html<TabsToolbar>`
    <template slot="end">
        ${when(x => x.defaultSlottedElements.length > 0, html`
            <div class="separator"></div>
        `)}
        ${startSlotTemplate(context, definition)}
        <slot
            ${slotted({
                filter: (n: Node) => n instanceof HTMLElement,
                property: 'defaultSlottedElements',
            })}
        >
        </slot>
        ${endSlotTemplate(context, definition)}
    </template>
`;
