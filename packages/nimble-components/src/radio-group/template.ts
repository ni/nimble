import { elements, html, slotted, ViewTemplate } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { RadioGroup } from '.';

// prettier-ignore
export const template: FoundationElementTemplate<ViewTemplate<RadioGroup>> = context => {
    return html<RadioGroup>`
        <div
            id="group"
            role="radiogroup"
            aria-labelledby="label"
            aria-disabled="${x => x.disabled}"
            aria-readonly="${x => x.readOnly}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
            @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
        >
            <label id="label" for="group">
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
