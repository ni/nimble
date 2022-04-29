import { html, ref, ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    FoundationElementTemplate,
    ButtonOptions
} from '@microsoft/fast-foundation';
import type { ToggleButton } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<ToggleButton>,
ButtonOptions
> = (context, definition) => html<ToggleButton>`
    <div
        role="button"
        part="control"
        tabindex="${x => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        class="control ${x => (x.checked ? 'checked' : '')}"
        ?disabled="${x => x.disabled}"
        ${
    '' /* Configure aria-disabled, aria-readonly, and aria-pressed based on the
        toggle button's state to keep the ARIA attributes consistent with the component's
        state without a client having to configure ARIA attributes directly */
}
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        aria-pressed="${x => x.checked}"
        ${
    '' /* Configure all other ARIA attributes based on the aria attributes
        configured on the toggle button */
}
        aria-atomic="${x => x.ariaAtomic}"
        aria-busy="${x => x.ariaBusy}"
        aria-controls="${x => x.ariaControls}"
        aria-current="${x => x.ariaCurrent}"
        aria-describedby="${x => x.ariaDescribedby}"
        aria-details="${x => x.ariaDetails}"
        aria-errormessage="${x => x.ariaErrormessage}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-flowto="${x => x.ariaFlowto}"
        aria-haspopup="${x => x.ariaHaspopup}"
        aria-hidden="${x => x.ariaHidden}"
        aria-invalid="${x => x.ariaInvalid}"
        aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-live="${x => x.ariaLive}"
        aria-owns="${x => x.ariaOwns}"
        aria-relevant="${x => x.ariaRelevant}"
        aria-roledescription="${x => x.ariaRoledescription}"
        ${ref('control')}
    >
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </div>
`;
