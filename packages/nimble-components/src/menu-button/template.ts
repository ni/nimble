import { elements, html, ref, slotted } from '@microsoft/fast-element';
import type { MenuButton } from '.';

export const template = html<MenuButton>`
    <template
        ?open="${x => x.open}"
        @focusout="${(x, c) => (x.focusoutHandler(c.event as FocusEvent))}"
        aria-haspopup="true"
        ?aria-expanded="${x => x.open}"
    >
        <nimble-toggle-button
            ?checked="${x => x.open && !x.disabled}"
            ?disabled="${x => x.disabled}"
            @change="${x => x.toggleButtonChangeHandler()}"
            tabindex="${x => (!x.disabled ? '0' : null)}"
            appearance="${x => x.appearance}"
            content-hidden="${x => x.contentHidden}"
            @keydown="${(x, c) => x.toggleButtonKeyDownHandler(c.event as KeyboardEvent)}"
            ${ref('toggleButton')}
        >
            <span slot="start">
                <slot name="start"></slot>
            </span>
            <slot></slot>
            <span slot="end">
                <slot name="end"></slot>
            </span>
        </nimble-toggle-button>
        <span
            part="menu"
            ?hidden="${x => !x.open || x.disabled}"
            @change="${x => x.menuChangeHandler()}"
            @keydown="${(x, c) => x.menuKeyDownHandler(c.event as KeyboardEvent)}"
        >
            <slot name="menu" ${slotted({ property: 'slottedMenus', filter: elements('[role=menu]') })}></slot>
        </span>
    </template>
`;