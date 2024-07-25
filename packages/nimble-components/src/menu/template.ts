import { children, html, type ViewTemplate } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { Menu } from '.';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Menu>
> = () => html`
    <template
        slot="${x => x.getSlot()}"
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
        ${children({ property: 'descendants', subtree: true, selector: '*' })}
    >
        <slot></slot>
    </template>
`;
