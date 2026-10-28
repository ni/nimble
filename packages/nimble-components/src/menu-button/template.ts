import { html, ref, slotted } from '@ni/fast-element';
import type { MenuButton } from '.';
import { toggleButtonTag } from '../toggle-button';
import { MenuButtonPosition } from './types';

export const template = html<MenuButton>`
    <template
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
    >
        <${toggleButtonTag}
            part="button"
            appearance="${x => x.appearance}"
            appearance-variant="${x => x.appearanceVariant}"
            ?content-hidden="${x => x.contentHidden}"
            ?checked="${x => x.isOpen}"
            ?disabled="${x => x.disabled}"
            tabindex="${x => x.tabIndex}"
            aria-haspopup="true"
            aria-expanded="${x => x.isOpen}"
            @change="${(x, c) => x.toggleButtonCheckedChangeHandler(c.event)}"
            @keydown="${(x, c) => x.toggleButtonKeyDownHandler(c.event as KeyboardEvent)}"
            ${ref('toggleButton')}
            exportparts="start,end"
        >
            ${'' /* Forward the contents of the 'start', 'end', and default slots to the toggle button */}
            <slot slot="start" name="start"></slot>
            <slot></slot>
            <slot slot="end" name="end"></slot>
        </${toggleButtonTag}>
        <div
            popover
            style="--ni-private-preferred-position-area: ${x => (x.position === MenuButtonPosition.above ? 'top span-right' : 'bottom span-right')};
                   --ni-private-position-fallbacks: ${x => x.positionAreaFallbacks};
                   --ni-private-menu-relative-alignment: ${x => (x.position === MenuButtonPosition.above ? 'unsafe end' : 'unsafe start')};"
            @keydown="${(x, c) => x.menuKeyDownHandler(c.event as KeyboardEvent)}"
            ${ref('popoverElement')}
        >
            <span part="menu">
                <slot name="menu" ${slotted({ property: 'slottedMenus' })}></slot>
            </span>
        </div>
    </template>
`;
