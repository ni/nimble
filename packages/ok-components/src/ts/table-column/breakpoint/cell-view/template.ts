import { html, ref, when } from '@ni/fast-element';
import type { TsTableColumnBreakpointCellView } from './index';
import { BreakpointState } from '../types';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';

// Placeholder SVGs for breakpoint states - to be replaced with proper icons later
const offSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#888" stroke-width="1.5"/></svg>`;
const enabledSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#E51400"/></svg>`;
const disabledSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#E51400" stroke-width="1.5"/><line x1="2" y1="10" x2="10" y2="2" stroke="#E51400" stroke-width="1.5"/></svg>`;
const hitSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#E51400"/><circle cx="6" cy="6" r="5" fill="none" stroke="#FFD700" stroke-width="1.5"/></svg>`;

export const template = html<TsTableColumnBreakpointCellView>`
    <button
        class="breakpoint-button state-${x => x.currentState}"
        @click="${(x, c) => x.onButtonClick(c.event)}"
        @contextmenu="${(x, c) => x.onContextMenu(c.event)}"
        @keydown="${(x, c) => x.onKeyDown(c.event as KeyboardEvent)}"
        aria-label="${x => x.ariaLabelText}"
        title="${x => x.tooltipText}"
        tabindex="-1"
    >
        ${when(x => x.currentState === BreakpointState.off, offSvg)}
        ${when(x => x.currentState === BreakpointState.enabled, enabledSvg)}
        ${when(x => x.currentState === BreakpointState.disabled, disabledSvg)}
        ${when(x => x.currentState === BreakpointState.hit, hitSvg)}
    </button>
    <${menuButtonTag}
        ${ref('contextMenuButton')}
        class="context-menu-button"
        content-hidden
        position="above"
        tabindex="-1"
        @click="${(_, c) => c.event.stopPropagation()}"
    >
        <${menuTag} slot="menu">
            ${when(x => x.currentState === BreakpointState.off, html<TsTableColumnBreakpointCellView>`
                <${menuItemTag} @change="${x => x.onAddMenuItemSelected()}">
                    Add breakpoint
                </${menuItemTag}>
            `)}
            ${when(x => x.currentState === BreakpointState.enabled || x.currentState === BreakpointState.hit, html<TsTableColumnBreakpointCellView>`
                <${menuItemTag} @change="${x => x.onDisableMenuItemSelected()}">
                    Disable breakpoint
                </${menuItemTag}>
                <${menuItemTag} @change="${x => x.onRemoveMenuItemSelected()}">
                    Remove breakpoint
                </${menuItemTag}>
            `)}
            ${when(x => x.currentState === BreakpointState.disabled, html<TsTableColumnBreakpointCellView>`
                <${menuItemTag} @change="${x => x.onEnableMenuItemSelected()}">
                    Enable breakpoint
                </${menuItemTag}>
                <${menuItemTag} @change="${x => x.onRemoveMenuItemSelected()}">
                    Remove breakpoint
                </${menuItemTag}>
            `)}
        </${menuTag}>
    </${menuButtonTag}>
`;
