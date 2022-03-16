import { html, ref } from '@microsoft/fast-element';
import type { ToggleButton } from '.';

export const template = html<ToggleButton>`
    <div
        role="button"
        part="control"
        aria-pressed="${(x: ToggleButton) => x.checked}"
        aria-disabled="${(x: ToggleButton) => x.disabled}"
        aria-readonly="${(x: ToggleButton) => x.readOnly}"
        tabindex="${(x: ToggleButton) => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        class="control ${(x: ToggleButton) => (x.checked ? 'checked' : '')}"
        ?disabled="${x => x.disabled}"
        ${ref('control')}
    >
        <span part="start" class="start">
            <slot name="start"></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
    </div>
`;
