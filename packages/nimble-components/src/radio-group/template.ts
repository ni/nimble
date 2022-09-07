import { elements, html, slotted, ViewTemplate } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { RadioGroup } from '.';

// prettier-ignore
export const template: FoundationElementTemplate<ViewTemplate<RadioGroup>> = _context => {
    return html<RadioGroup>`
        <div
            role="radiogroup"
            aria-labelledby="label"
            aria-disabled="${x => x.disabled}"
            aria-readonly="${x => x.readOnly}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
            @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
            aria-atomic="${x => x.ariaAtomic}"
            aria-busy="${x => x.ariaBusy}"
            aria-controls="${x => x.ariaControls}"
            aria-current="${x => x.ariaCurrent}"
            aria-describedby="${x => x.ariaDescribedby}"
            aria-details="${x => x.ariaDetails}"
            aria-errormessage="${x => x.ariaErrormessage}"
            aria-flowto="${x => x.ariaFlowto}"
            aria-haspopup="${x => x.ariaHaspopup}"
            aria-hidden="${x => x.ariaHidden}"
            aria-invalid="${x => x.ariaInvalid}"
            aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
            aria-label="${x => x.ariaLabel}"
            aria-live="${x => x.ariaLive}"
            aria-owns="${x => x.ariaOwns}"
            aria-relevant="${x => x.ariaRelevant}"
            aria-roledescription="${x => x.ariaRoledescription}"
        >
            <label id="label">
                <slot name="label"></slot>
            </label>
            <div
                class="positioning-region ${x => (x.orientation === Orientation.horizontal ? 'horizontal' : 'vertical')}"
                part="positioning-region"
            >
                <slot ${slotted({ property: 'slottedRadioButtons', filter: elements('[role=radio]') })} ></slot>
            </div>
        </div>
    `;
};
