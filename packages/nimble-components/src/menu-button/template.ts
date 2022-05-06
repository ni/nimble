import { elements, html, ref, slotted, when } from '@microsoft/fast-element';
import type { MenuButton } from '.';

// prettier-ignore
export const template = html<MenuButton>`
    <template
        ?open="${x => x.open}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
    >
        <nimble-toggle-button
            part="button"
            appearance="${x => x.appearance}"
            content-hidden="${x => x.contentHidden}"
            ?checked="${x => x.open}"
            ?disabled="${x => x.disabled}"
            aria-haspopup="true"
            aria-expanded="${x => x.open}"
            @change="${(x, c) => x.toggleButtonCheckedChangeHandler(c.event)}"
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
            x => x.open,
            html<MenuButton>`
                <nimble-anchored-region
                    fixed-placement="true"
                    auto-update-mode="auto"
                    horizontal-inset="true"
                    horizontal-positioning-mode="dynamic"
                    vertical-positioning-mode="${x => (x.position === 'auto' ? 'dynamic' : 'locktodefault')}"
                    vertical-default-position="${x => (x.position === 'above' ? 'top' : 'bottom')}"
                    @loaded="${x => x.handleRegionLoaded()}"
                    @change="${x => x.menuChangeHandler()}"
                    @keydown="${(x, c) => x.menuKeyDownHandler(c.event as KeyboardEvent)}"
                    ${ref('region')}
                >
                    <span part="menu">
                        <slot name="menu" ${slotted({ property: 'slottedMenus', filter: elements('[role=menu]') })}></slot>
                    </span>
                </nimble-anchored-region>
            `
        )}
    </template>
`;
