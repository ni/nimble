import { elements, html, slotted } from '@ni/fast-element';
import { Orientation } from '@ni/fast-web-utilities';
import type { RadioGroup } from '.';
import { errorTextTemplate } from '../patterns/error/template';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { createRequiredVisibleLabelTemplate } from '../patterns/required-visible/template';

const labelTemplate = createRequiredVisibleLabelTemplate(
    html<RadioGroup>`<slot name="label"></slot>`
);

export const template = html<RadioGroup>`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        aria-required="${x => x.requiredVisible}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
    >
        <div class="label-container">
            ${labelTemplate}
            <${iconExclamationMarkTag}
                severity="error"
                class="error-icon"
            ></${iconExclamationMarkTag}>
        </div>
        <div
            class="positioning-region ${x => (x.orientation === Orientation.horizontal ? 'horizontal' : 'vertical')}"
            part="positioning-region"
        >
            <slot
                ${slotted({
                    property: 'slottedRadioButtons',
                    filter: elements('[role=radio]')
                })}
            ></slot>
            ${errorTextTemplate}
        </div>
    </template>
`;
