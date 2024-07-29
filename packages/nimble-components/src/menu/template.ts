import {
    children,
    html,
    slotted,
    type ViewTemplate
} from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { Menu } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Menu>
> = () => html`
    <template
        slot="${x => {
            if (x.slot) {
                return x.slot;
            }
            return x.isNestedMenu() ? 'submenu' : undefined;
        }}"
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
        ${children({ property: 'itemIcons', subtree: true, attributeFilter: ['slot'], selector: ':scope > * > [slot="start"]' })}
    >
        <slot ${slotted('items')}></slot>
    </template>
`;
/* eslint-enable @typescript-eslint/indent */
