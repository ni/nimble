/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { ViewTemplate, html, slotted } from '@microsoft/fast-element';
import type { CheckboxOptions, OverrideFoundationElementDefinition } from '@microsoft/fast-foundation';
import type { Checkbox } from '.';

/**
 * The template for the {@link @microsoft/fast-foundation#(Checkbox:class)} component.
 * @public
 */
export const checkboxTemplate = (_: unknown, definition: OverrideFoundationElementDefinition<CheckboxOptions>): ViewTemplate<Checkbox> => html<Checkbox>`
    <template
        role="checkbox"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        tabindex="${x => (x.disabled ? null : x.tabIndexOverride)}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        class="${x => (x.readOnly ? 'readonly' : '')} ${x => (x.checked ? 'checked' : '')} ${x => (x.indeterminate ? 'indeterminate' : '')}"
    >
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
            class="${x => (x.defaultSlottedNodes && x.defaultSlottedNodes.length
        ? 'label'
        : 'label label__hidden')}"
        >
            <slot ${slotted('defaultSlottedNodes')}></slot>
        </label>
    </template>
`;
