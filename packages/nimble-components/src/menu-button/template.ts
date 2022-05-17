import { elements, html, ref, slotted, ViewTemplate, when } from '@microsoft/fast-element';
import { AnchoredRegion as FoundationAnchoredRegion, FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { MenuButton } from '.';
import { ToggleButton } from '../toggle-button';
import '../anchored-region';

// prettier-ignore
export const template: FoundationElementTemplate<ViewTemplate<MenuButton>> = context => html<MenuButton>`
    <template
        ?open="${x => x.open}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
    >
        <${context.tagFor(ToggleButton)}
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
        </${context.tagFor(ToggleButton)}>
        ${when(
        x => x.open,
        html<MenuButton>`
            <${context.tagFor(FoundationAnchoredRegion)}
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-inset="true"
                horizontal-positioning-mode="dynamic"
                vertical-positioning-mode="${x => (x.position === 'auto' ? 'dynamic' : 'locktodefault')}"
                vertical-default-position="${x => (x.position === 'above' ? 'top' : 'bottom')}"
                @loaded="${x => x.regionLoadedHandler()}"
                @change="${x => x.menuChangeHandler()}"
                @keydown="${(x, c) => x.menuKeyDownHandler(c.event as KeyboardEvent)}"
                ${ref('region')}
            >
                <span part="menu">
                    <slot name="menu" ${slotted({ property: 'slottedMenus', filter: elements('[role=menu]') })}></slot>
                </span>
            </${context.tagFor(FoundationAnchoredRegion)}>
        `
    )}
    </template>
`;
