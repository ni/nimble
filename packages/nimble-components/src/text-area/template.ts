import { html, ref, slotted, ViewTemplate } from '@ni/fast-element';
import type { FoundationElementTemplate } from '@ni/fast-foundation';
import type { TextArea } from '.';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { errorTextTemplate } from '../patterns/error/template';
import { createRequiredVisibleLabelTemplate } from '../patterns/required-visible/template';

const labelTemplate = createRequiredVisibleLabelTemplate(html<TextArea>`
    <label
        part="label"
        for="control"
        class="${x => (x.defaultSlottedNodes?.length ? 'label' : 'label label__hidden')}"
    >
        <slot ${slotted('defaultSlottedNodes')}></slot>
    </label>
`);

export const template: FoundationElementTemplate<
ViewTemplate<TextArea>
> = () => html<TextArea>`
    ${labelTemplate}
    <div class="container">
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${x => x.autofocus}"
            cols="${x => x.cols}"
            ?disabled="${x => x.disabled}"
            form="${x => x.form}"
            list="${x => x.list}"
            maxlength="${x => x.maxlength}"
            minlength="${x => x.minlength}"
            name="${x => x.name}"
            placeholder="${x => x.placeholder}"
            ?readonly="${x => x.readOnly}"
            ?required="${x => x.required}"
            rows="${x => x.rows}"
            ?spellcheck="${x => x.spellcheck}"
            :value="${x => x.value}"
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
            @input="${x => x.onTextAreaInput()}"
            @change="${x => x.handleChange()}"
            ${ref('control')}
        ></textarea>
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon ${x => (x.scrollbarWidth >= 0 ? 'scrollbar-width-calculated' : '')}"
            style="--ni-private-scrollbar-width: ${x => x.scrollbarWidth}px;"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    </div>
`;
