import { html } from '@ni/fast-element';
import type { FvSplitter } from '.';

export const template = html<FvSplitter>`
    <div
        class="splitter ${x => (x.resizing ? 'resizing' : '')}"
        tabindex="-1"
        @pointerdown="${(x, c) => x.handlePointerDown(c.event as PointerEvent)}"
        @pointermove="${(x, c) => x.handlePointerMove(c.event as PointerEvent)}"
        @pointerup="${(x, c) => x.handlePointerUp(c.event as PointerEvent)}"
        @pointercancel="${(x, c) => x.handlePointerCancel(c.event as PointerEvent)}"
        @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
    ></div>
`;