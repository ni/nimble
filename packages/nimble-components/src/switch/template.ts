import { html, slotted } from '@microsoft/fast-element';
import type { Switch } from '.';

export const template = html<Switch>`
    <template
        role="switch"
        aria-checked="${x => x.checked}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        tabindex="${x => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        class="${x => (x.checked ? 'checked' : '')}"
    >
        <label
            part="label"
            class="${x => (x.defaultSlottedNodes?.length
        ? 'label'
        : 'label label__hidden')}"
        >
            <slot ${slotted('defaultSlottedNodes')}></slot>
        </label>
        <div class="switch-container">
            <span class="status-message unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
            <div part="switch" class="switch">
                <slot name="switch">
                    <span class="checked-indicator-spacer"></span>
                    <span class="checked-indicator" part="checked-indicator">
                        <span class="checked-indicator-inner">
                    </span>
                </slot>
            </div>
            <span class="status-message checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
        </div>
    </template>
`;
