import { html, slotted } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type { FoundationElementTemplate, RadioOptions } from '@microsoft/fast-foundation';
import type { Radio } from '.';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

export const template: FoundationElementTemplate<
ViewTemplate<Radio>,
RadioOptions
> = (_context, definition) => html`
    <template
        role="radio"
        class="${x => (x.checked ? 'checked' : '')} ${x => (x.readOnly ? 'readonly' : '')}"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
    >
        <div class="container">
            <div part="control" class="control" @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}">
                <slot name="checked-indicator">
                    ${definition.checkedIndicator || ''}
                </slot>
            </div>
            <label
                part="label"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
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
        </div>
    </template>
`;