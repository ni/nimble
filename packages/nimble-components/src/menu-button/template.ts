import { elements, html, ref, slotted, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { MenuButton } from '.';
import { ToggleButton } from '../toggle-button';
import { AnchoredRegion } from '../anchored-region';

// prettier-ignore
export const template = html<MenuButton>`
    <template
        ?open="${x => x.open}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
    >
        <${DesignSystem.tagFor(ToggleButton)}
            part="button"
            appearance="${x => x.appearance}"
            ?content-hidden="${x => x.contentHidden}"
            ?checked="${x => x.open}"
            ?disabled="${x => x.disabled}"
            aria-haspopup="true"
            aria-expanded="${x => x.open}"
            @change="${(x, c) => x.toggleButtonCheckedChangeHandler(c.event)}"
            @keydown="${(x, c) => x.toggleButtonKeyDownHandler(c.event as KeyboardEvent)}"
            ${ref('toggleButton')}
            exportparts="start,end"
        >
            ${'' /* Forward the contents of the 'start', 'end', and default slots to the toggle button */}
            <slot slot="start" name="start"></slot>
            <slot></slot>
            <slot slot="end" name="end"></slot>
        </${DesignSystem.tagFor(ToggleButton)}>
        ${when(
        x => x.open,
        html<MenuButton>`
            <${DesignSystem.tagFor(AnchoredRegion)}
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-inset="true"
                horizontal-positioning-mode="dynamic"
                vertical-positioning-mode="${x => (x.position === 'auto' ? 'dynamic' : 'locktodefault')}"
                vertical-default-position="${x => (x.position === 'above' ? 'top' : 'bottom')}"
                @loaded="${x => x.regionLoadedHandler()}"
                @keydown="${(x, c) => x.menuKeyDownHandler(c.event as KeyboardEvent)}"
                ${ref('region')}
            >
                <span part="menu">
                    <slot name="menu" ${slotted({ property: 'slottedMenus', filter: elements('[role=menu]') })}></slot>
                </span>
            </${DesignSystem.tagFor(AnchoredRegion)}>
        `
    )}
    </template>
`;
