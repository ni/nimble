import { html, ref, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import { AnchoredRegion, endSlotTemplate, startSlotTemplate, MenuItemRole } from '@microsoft/fast-foundation';
import type { ElementDefinitionContext, MenuItemOptions } from '@microsoft/fast-foundation';
import type { Direction } from '@microsoft/fast-web-utilities';
import type { MenuItem } from './index';

/**
 * Generates a template for the {@link @microsoft/fast-foundation#(MenuItem:class)} component using
 * the provided prefix.
 *
 * @public
 */
export const nimbleMenuItemTemplate: (
    context: ElementDefinitionContext,
    definition: MenuItemOptions
) => ViewTemplate<MenuItem> = (
    context: ElementDefinitionContext,
    definition: MenuItemOptions
) => html<MenuItem>`
    <template
        role="${(x): MenuItemRole => x.role}"
        aria-haspopup="${(x): string | undefined => (x.hasSubmenu ? 'menu' : undefined)}"
        aria-checked="${(x): boolean | undefined => (x.role !== MenuItemRole.menuitem ? x.checked : undefined)}"
        aria-disabled="${(x): boolean => x.disabled}"
        aria-expanded="${(x): boolean => x.expanded}"
        @keydown="${(x, c): boolean => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
        @click="${(x, c): boolean => x.handleMenuItemClick(c.event as MouseEvent)}"
        @mouseover="${(x, c): boolean => x.handleMouseOver(c.event as MouseEvent)}"
        @mouseout="${(x, c): boolean => x.handleMouseOut(c.event as MouseEvent)}"
        class="${(x): string => (x.disabled ? 'disabled' : '')} ${(x): string => (x.expanded ? 'expanded' : '')} ${(x): string => `indent-${x.startColumnCount}`}"
    >
            ${when(x => x.role === MenuItemRole.menuitemcheckbox, html<MenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${definition.checkboxIndicator || ''}
                            </slot>
                        </span>
                    </div>
                `)}
            ${when(x => x.role === MenuItemRole.menuitemradio, html<MenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${definition.radioIndicator || ''}
                            </slot>
                        </span>
                    </div>
                `)}
        </div>
        ${startSlotTemplate(context, definition)}
        <span class="icon" part="icon">
            <slot name="icon" ${ref('icon')}></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endSlotTemplate(context, definition)}
        ${when(x => x.hasSubmenu, html<MenuItem>`
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
            `)}
        ${when(x => x.expanded, html<MenuItem>`
                <${context.tagFor(AnchoredRegion)}
                    :anchorElement="${(x): MenuItem => x}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu-region"
                    dir="${(x): Direction => x.currentDirection}"
                    @loaded="${(x): void => x.submenuLoaded()}"
                    ${ref('submenuRegion')}
                    part="submenu-region"
                >
                    <slot name="submenu"></slot>
                </${context.tagFor(AnchoredRegion)}>
            `)}
    </template>
`;