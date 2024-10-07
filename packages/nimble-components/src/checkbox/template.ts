import { html, slotted, type ViewTemplate } from '@microsoft/fast-element';
import type {
    CheckboxOptions,
    FoundationElementTemplate
} from '@microsoft/fast-foundation';
import type { Checkbox } from '.';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { errorTextTemplate } from '../patterns/error/template';

export const template: FoundationElementTemplate<
ViewTemplate<Checkbox>,
CheckboxOptions
> = (_context, definition) => html`
    <template
        role="checkbox"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        tabindex="${x => x.resolvedTabindex}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        class="${x => (x.readOnly ? 'readonly' : '')} ${x => (x.checked ? 'checked' : '')} ${x => (x.indeterminate ? 'indeterminate' : '')}"
    >
        <div class="container">
            <div part="control" class="control">
                <slot name="checked-indicator">
                    ${definition.checkedIndicator || ''}
                </slot>
                <slot name="indeterminate-indicator">
                    ${definition.indeterminateIndicator || ''}
                </slot>
            </div>
            <label
                part="label"
                class="${x => (x.defaultSlottedNodes?.length
        ? 'label'
        : 'label label__hidden')}"
            >
                <slot ${slotted('defaultSlottedNodes')}></slot>
            </label>
            <${iconExclamationMarkTag}
                severity="error"
                class="error-icon"
            ></${iconExclamationMarkTag}>
            ${errorTextTemplate}
        </div>
    </template>
`;
