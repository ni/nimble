import { html, ref, when } from '@ni/fast-element';
import type { TsTableColumnBreakpointCellView } from '.';
import { BreakpointState } from '../types';
import { iconBreakpointConditionalTag } from "@ni/spright-components/dist/esm/icons/breakpoint-conditional";
import { iconBreakpointDisabledTag } from "@ni/spright-components/dist/esm/icons/breakpoint-disabled";
import { iconBreakpointHitTag } from "@ni/spright-components/dist/esm/icons/breakpoint-hit";
import { iconBreakpointHitDisabledTag } from "@ni/spright-components/dist/esm/icons/breakpoint-hit-disabled";
import { iconBreakpointEnabledTag } from "@ni/spright-components/dist/esm/icons/breakpoint-enabled";
import { iconBreakpointHoverTag } from "@ni/spright-components/dist/esm/icons/breakpoint-hover";

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
        ${when(x => x.currentState === BreakpointState.off, html`<${iconBreakpointHoverTag} />`)}
        ${when(x => x.currentState === BreakpointState.enabled, html`<${iconBreakpointEnabledTag} />`)}
        ${when(x => x.currentState === BreakpointState.disabled, html`<${iconBreakpointDisabledTag} />`)}
        ${when(x => x.currentState === BreakpointState.hit, html`<${iconBreakpointHitTag} />`)}
        ${when(x => x.currentState === BreakpointState.conditional, html`<${iconBreakpointConditionalTag} />`)}
        ${when(x => x.currentState === BreakpointState.hitDisabled, html`<${iconBreakpointHitDisabledTag} />`)}
    </button>
`;
