import { html, ref, slotted, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    FoundationElementTemplate,
    NumberFieldOptions,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { NumberField } from '.';
import { createRequiredVisibleLabelTemplate } from '../patterns/required-visible/template';

const labelTemplate = createRequiredVisibleLabelTemplate(
    html<NumberField>`<label
        part="label"
        for="control"
        class="${x => (x.defaultSlottedNodes?.length ? 'label' : 'label label__hidden')}"
    >
        <slot ${slotted('defaultSlottedNodes')}></slot>
    </label>`
);

/**
 * The template for the {@link @microsoft/fast-foundation#(NumberField:class)} component.
 * @public
 */
export const template: FoundationElementTemplate<
ViewTemplate<NumberField>,
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
                @input="${x => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
                @blur="${x => x.handleBlur()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                list="${x => x.list}"
                maxlength="${x => x.maxlength}"
                minlength="${x => x.minlength}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                size="${x => x.size}"
                type="text"
                inputmode="numeric"
                min="${x => x.min}"
                max="${x => x.max}"
                step="${x => x.step}"
                aria-atomic="${x => x.ariaAtomic}"
                aria-busy="${x => x.ariaBusy}"
                aria-controls="${x => x.ariaControls}"
                aria-current="${x => x.ariaCurrent}"
                aria-describedby="${x => x.ariaDescribedby}"
                aria-details="${x => x.ariaDetails}"
                aria-disabled="${x => x.ariaDisabled}"
                aria-errormessage="${x => x.ariaErrormessage}"
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
                aria-required="${x => x.requiredVisible}"
                ${ref('control')}
            />
            ${when(
        x => !x.hideStep && !x.readOnly && !x.disabled,
        html<NumberField>`
                    <div class="controls" part="controls">
                        <div
                            class="step-up"
                            part="step-up"
                            @click="${x => x.stepUp()}"
                        >
                            <slot name="step-up-glyph">
                                ${definition.stepUpGlyph || ''}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${x => x.stepDown()}"
                        >
                            <slot name="step-down-glyph">
                                ${definition.stepDownGlyph || ''}
                            </slot>
                        </div>
                    </div>
                `
    )}
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;
