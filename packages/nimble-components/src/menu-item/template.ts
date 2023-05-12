import {
    elements,
    html,
    ref,
    slotted,
    ViewTemplate,
    when
} from '@microsoft/fast-element';
import {
    endSlotTemplate,
    FoundationElementTemplate,
    MenuItemOptions,
    MenuItemRole,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { MenuItem } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<MenuItem>,
MenuItemOptions
> = (context, definition) => html<MenuItem>`
    <template
        role="${x => x.role}"
        aria-haspopup="${x => (x.hasSubmenu ? 'menu' : null)}"
        aria-checked="${x => (x.role !== MenuItemRole.menuitem ? x.checked : null)}"
        aria-disabled="${x => x.disabled}"
        aria-expanded="${x => x.expanded}"
        @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}"
        @mouseover="${(x, c) => x.handleMouseOver(c.event as MouseEvent)}"
        @mouseout="${(x, c) => x.handleMouseOut(c.event as MouseEvent)}"
        class="${x => (x.disabled ? 'disabled' : '')} ${x => (x.expanded ? 'expanded' : '')} ${x => `indent-${x.startColumnCount}`}"
    >
            ${when(
        x => x.role === MenuItemRole.menuitemcheckbox,
        html<MenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${definition.checkboxIndicator || ''}
                            </slot>
                        </span>
                    </div>
                `
    )}
            ${when(
        x => x.role === MenuItemRole.menuitemradio,
        html<MenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${definition.radioIndicator || ''}
                            </slot>
                        </span>
                    </div>
                `
    )}
        </div>
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endSlotTemplate(context, definition)}
        ${when(
        x => x.hasSubmenu,
        html<MenuItem>`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${definition.expandCollapseGlyph || ''}
                        </slot>
                    </span>
                </div>
            `
    )}
        <span
            ?hidden="${x => !x.expanded}"
            class="submenu-container"
            part="submenu-container"
            ${ref('submenuContainer')}
        >
            <slot name="submenu" ${slotted({
        property: 'slottedSubmenu',
        filter: elements("[role='menu']")
    })}></slot>
        </span>
    </template>
    `;
