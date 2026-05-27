import { html, ref, when } from '@ni/fast-element';
import type { TsTableColumnBreakpointCellView } from '.';
import { BreakpointState } from '../types';

// Placeholder SVGs for breakpoint states - to be replaced with proper icons later
const offSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#888" stroke-width="1.5"/></svg>`;
const enabledSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#E51400"/></svg>`;
const disabledSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#E51400" stroke-width="1.5"/><line x1="2" y1="10" x2="10" y2="2" stroke="#E51400" stroke-width="1.5"/></svg>`;
const hitSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#E51400"/><circle cx="6" cy="6" r="5" fill="none" stroke="#FFD700" stroke-width="1.5"/></svg>`;
const conditionalSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><polygon points="6,1 11,6 6,11 1,6" fill="#FFD700"/></svg>`;
const hitDisabledSvg = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#E51400"/><circle cx="6" cy="6" r="5" fill="none" stroke="#FFD700" stroke-width="1.5"/><line x1="2" y1="10" x2="10" y2="2" stroke="#888" stroke-width="1.5"/></svg>`;

export const template = html<TsTableColumnBreakpointCellView>`
    <button
        ${ref('button')}
        part="button"
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
        ${when(x => x.currentState === BreakpointState.conditional, conditionalSvg)}
        ${when(x => x.currentState === BreakpointState.hitDisabled, hitDisabledSvg)}
    </button>
`;
