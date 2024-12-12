import { elements, html, slotted, when } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import type { RadioGroup } from '.';
import { errorTextTemplate } from '../patterns/error/template';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { iconAsteriskTag } from '../icons/asterisk';

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
        ${''
        /**
         * Don't use the shared label required-visible label template here because the error icon
         * needs to be positioned within the label as well.
         */}
        <div class="label-container">
            <slot name="label"></slot>
            ${when(x => x.requiredVisible, html`
                <${iconAsteriskTag} class="required-icon" severity="error"></${iconAsteriskTag}>
            `)}
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
