import { elements, html, slotted } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import type { RadioGroup } from '.';
import { errorTextTemplate } from '../patterns/error/template';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

/* eslint-disable @typescript-eslint/indent */
export const template = html<RadioGroup>`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
    >
        <div class="label-container">
            <slot name="label"></slot>            
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
