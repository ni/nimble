import { elements, html, slotted } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { RadioGroup } from '.';
import { errorTextTemplate } from '../patterns/error/template';

export const template: FoundationElementTemplate<ViewTemplate<RadioGroup>> = (
    _context,
    _definition
) => html`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${x => (x.orientation === Orientation.horizontal ? 'horizontal' : 'vertical')}"
            part="positioning-region"
        >
            <slot
                ${slotted({
        property: 'nimbleSlottedRadioButtons',
        filter: elements('[role=radio]'),
    })}
            ></slot>
            ${errorTextTemplate}
        </div>
    </template>
`;