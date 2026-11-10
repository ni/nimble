import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import { fvMultiSelectTag } from '@ni/ok-components/dist/esm/fv/multi-select';
import type { FvMultiSelectOption } from '@ni/ok-components/dist/esm/fv/multi-select/types';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { apiCategory, createUserSelectedThemeStory, okWarning } from '../../../utilities/storybook';

interface MultiSelectArgs {
    label: string;
    name: string;
    required: boolean;
    placeholder: string;
    appearance: DropdownAppearance;
    disabled: boolean;
    filterable: boolean;
    clearable: boolean;
    options: FvMultiSelectOption[];
    selectedValues: string[];
}

const metadata: Meta<MultiSelectArgs> = {
    title: 'Ok/Fv Multi Select',
    decorators: [withActions<HtmlRenderer>],
    parameters: { actions: { handles: ['input', 'change'] } },
    render: createUserSelectedThemeStory(html<MultiSelectArgs>`
        ${okWarning({
            componentName: 'Fv Multi Select',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <div style="padding: 16px; min-height: 340px;">
            <${fvMultiSelectTag}
                label="${x => x.label}"
                name="${x => x.name}"
                ?required="${x => x.required}"
                placeholder="${x => x.placeholder}"
                appearance="${x => x.appearance}"
                ?disabled="${x => x.disabled}"
                ?filterable="${x => x.filterable}"
                ?clearable="${x => x.clearable}"
                :options="${x => x.options}"
                :selectedValues="${x => x.selectedValues}"
            ></${fvMultiSelectTag}>
        </div>
    `),
    argTypes: {
        label: { table: { category: apiCategory.attributes } },
        name: { table: { category: apiCategory.attributes } },
        required: { table: { category: apiCategory.attributes } },
        placeholder: { table: { category: apiCategory.attributes } },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        disabled: { table: { category: apiCategory.attributes } },
        filterable: { table: { category: apiCategory.attributes } },
        clearable: { table: { category: apiCategory.attributes } },
        options: {
            description: 'Options with unique values, labels, and optional disabled state. Assign a new array to update.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        selectedValues: {
            description: 'Selected option values. Assign a new array to update. User toggles emit input and change.',
            table: { category: apiCategory.nonAttributeProperties }
        }
    },
    args: {
        label: 'Status',
        name: 'status',
        required: false,
        placeholder: 'Select statuses',
        appearance: DropdownAppearance.underline,
        disabled: false,
        filterable: true,
        clearable: true,
        options: [
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'error', label: 'Error', disabled: true },
            { value: 'maintenance', label: 'Maintenance due' },
            { value: 'cafe', label: 'Caf\u00e9' }
        ],
        selectedValues: ['active']
    }
};

export default metadata;

export const defaultStory: StoryObj<MultiSelectArgs> = {
    name: 'Fv Multi Select'
};
