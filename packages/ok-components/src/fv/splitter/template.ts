import { html } from '@ni/fast-element';
import type { FvSplitter } from '.';

export const template = html<FvSplitter>`
    <div
        class="splitter ${x => (x.resizing ? 'resizing' : '')}"
        role="separator"
        tabindex="0"
        aria-orientation="vertical"
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
        aria-valuenow="${x => x.position}"
        aria-valuetext="${x => `${Math.round(x.position)} percent`}"
        @pointerdown="${(x, c) => x.handlePointerDown(c.event as PointerEvent)}"
        @pointermove="${(x, c) => x.handlePointerMove(c.event as PointerEvent)}"
        @pointerup="${(x, c) => x.handlePointerUp(c.event as PointerEvent)}"
        @pointercancel="${(x, c) => x.handlePointerCancel(c.event as PointerEvent)}"
        @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
    ></div>
`;