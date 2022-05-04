import { elements, html, ref, slotted, when } from '@microsoft/fast-element';
import type { MenuButton } from '.';

export const template = html<MenuButton>`
    <template
        ?open="${x => x.open}"
        @focusout="${(x, c) => (x.focusoutHandler(c.event as FocusEvent))}"
    >
        <nimble-toggle-button
            part="button"
            ?checked="${x => x.open && !x.disabled}"
            ?disabled="${x => x.disabled}"
            aria-haspopup="true"
            aria-expanded="${x => x.open}"
            @change="${x => x.toggleButtonChangeHandler()}"
            appearance="${x => x.appearance}"
            content-hidden="${x => x.contentHidden}"
            @keydown="${(x, c) => x.toggleButtonKeyDownHandler(c.event as KeyboardEvent)}"
            ${ref('toggleButton')}
        >
            <span slot="start" part="start">
                <slot name="start"></slot>
            </span>
            <slot></slot>
            <span slot="end" part="end">
                <slot name="end"></slot>
            </span>
        </nimble-toggle-button>
        ${when(
        x => x.open && !x.disabled,
        html<MenuButton>`
        <nimble-anchored-region
            fixed-placement="true"
            auto-update-mode="auto"
            horizontal-inset="true"
            horizontal-positioning-mode="dynamic"
            vertical-positioning-mode="${x => (x.position === 'auto' ? 'dynamic' : 'locktodefault')}"
            vertical-default-position="${x => (x.position === 'above' ? 'top' : 'bottom')}"
            @loaded="${x => x.handleRegionLoaded()}"
            ${ref('region')}
        >
            <span
                part="menu"
                @change="${x => x.menuChangeHandler()}"
                @keydown="${(x, c) => x.menuKeyDownHandler(c.event as KeyboardEvent)}"
            >
                <slot name="menu" ${slotted({ property: 'slottedMenus', filter: elements('[role=menu]') })}></slot>
            </span>
        </nimble-anchored-region>
    </template>
    `
    )}
`;
