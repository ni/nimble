import { html, ref, slotted } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    type FoundationElementTemplate,
    type NumberFieldOptions,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import { createRequiredVisibleLabelTemplate } from '@ni/nimble-components/dist/esm/patterns/required-visible/template';
import type { FormattedNumberField } from '.';

const labelTemplate = createRequiredVisibleLabelTemplate(
    html<FormattedNumberField>`<label
        part="label"
        for="control"
        class="label"
    >
        <slot></slot>
    </label>`
);

/**
 * The template for the {@link @microsoft/fast-foundation#(NumberField:class)} component.
 * @public
 */
export const template: FoundationElementTemplate<
ViewTemplate<FormattedNumberField>,
NumberFieldOptions
> = (context, definition) => html`
    <template class="${x => (x.readOnly ? 'readonly' : '')}">
        ${labelTemplate}
        <div class="root" part="root">
            ${startSlotTemplate(context, definition)}
            <input
                class="control"
                part="control"
                id="control"
                ?autofocus="${x => x.autofocus}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                type="text"
                inputmode="numeric"
                aria-atomic="${x => x.ariaAtomic}"
                aria-busy="${x => x.ariaBusy}"
                aria-current="${x => x.ariaCurrent}"
                aria-disabled="${x => x.ariaDisabled}"
                aria-hidden="${x => x.ariaHidden}"
                aria-invalid="${x => x.ariaInvalid}"
                aria-label="${x => x.ariaLabel}"
                aria-live="${x => x.ariaLive}"
                aria-required="${x => x.requiredVisible}"
                ${ref('control')}
            />
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;
