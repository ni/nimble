import { html, ref, slotted, when } from '@microsoft/fast-element';
import type { MenuButton } from '.';
import { toggleButtonTag } from '../toggle-button';

// prettier-ignore
export const template = html<MenuButton>`
    <template
        ?open="${x => x.open}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
    >
        <${toggleButtonTag}
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
        </${toggleButtonTag}>
        ${when(
        x => x.open,
        html<MenuButton>`
            <span
                ${ref('menu')}
                part="menu"
                @keydown="${(x, c) => x.menuKeyDownHandler(c.event as KeyboardEvent)}"
            >
                <slot name="menu" ${slotted({ property: 'slottedMenus' })}></slot>
            </span>
        `
    )}
    </template>
`;
