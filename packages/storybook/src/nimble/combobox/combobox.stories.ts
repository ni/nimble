import { ComboboxAutocomplete } from '@microsoft/fast-foundation';
import { html, repeat } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { comboboxTag } from '../../../../nimble-components/src/combobox';
import { ExampleOptionsType } from '../../../../nimble-components/src/combobox/tests/types';
import {
    DropdownAppearance,
    DropdownPosition
} from '../../../../nimble-components/src/patterns/dropdown/types';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    disabledDescription,
    dropdownPositionDescription,
    errorTextDescription,
    errorVisibleDescription,
    optionsDescription,
    placeholderDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

interface ComboboxArgs {
    label: string;
    disabled: boolean;
    dropDownPosition: DropdownPosition;
    autocomplete: ComboboxAutocomplete;
    optionsType: ExampleOptionsType;
    errorVisible: boolean;
    errorText: string;
    currentValue: string;
    appearance: string;
    placeholder: string;
    change: undefined;
    input: undefined;
}

interface OptionArgs {
    label: string;
    disabled: boolean;
}

const simpleOptions: readonly OptionArgs[] = [
    { label: 'Mary', disabled: false },
    { label: 'Sue', disabled: false },
    { label: 'Joaquin', disabled: false },
    { label: 'Frank', disabled: false },
    { label: 'Dracula', disabled: true },
    { label: 'Albert', disabled: false },
    { label: 'Sue Ann', disabled: false }
] as const;

const wideOptions: readonly OptionArgs[] = [
    {
        label: 'Option 1 that is too long to fit in the drop down width',
        disabled: false
    },
    { label: 'Option 2 that is also too long but disabled', disabled: true },
    { label: 'Short', disabled: false }
] as const;

const names = [
    'Mary',
    'Sue',
    'Joaquin',
    'Frank',
    'Dracula',
    'Albert',
    'Sue Ann'
];
const manyOptions: OptionArgs[] = [];
for (let i = 0; i < 100; i++) {
    manyOptions.push({
        label: `${names[i % names.length]!} (${i})`,
        disabled: false
    });
}

const optionSets = {
    [ExampleOptionsType.simpleOptions]: simpleOptions,
    [ExampleOptionsType.wideOptions]: wideOptions,
    [ExampleOptionsType.manyOptions]: manyOptions
} as const;

const metadata: Meta<ComboboxArgs> = {
    title: 'Components/Combobox',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change', 'input']
        },
        toolbar: {
            zoom: { hidden: true }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        ${disableStorybookZoomTransform}
        <${comboboxTag}
            autocomplete="${x => x.autocomplete}"
            ?disabled="${x => x.disabled}"
            position="${x => x.dropDownPosition}"
            error-text="${x => x.errorText}"
            ?error-visible="${x => x.errorVisible}"
            appearance="${x => x.appearance}"
            value="${x => x.currentValue}"
            placeholder="${x => x.placeholder}"
            style="min-width: 250px;"
        >
            ${x => x.label}
            ${repeat(x => optionSets[x.optionsType], html<OptionArgs>`
                <${listOptionTag} ?disabled="${x => x.disabled}">${x => x.label}</${listOptionTag}>
            `)}
        </${comboboxTag}>
    `),
    argTypes: {
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'combobox' })}`,
            table: { category: apiCategory.slots }
        },
        autocomplete: {
            options: Object.values(ComboboxAutocomplete),
            control: { type: 'radio' },
            description: `- inline: Automatically matches the first option that matches the start of the entered text.
- list: Filters the dropdown to options that start with the entered text.
- both: Automatically matches and filters list to options that start with the entered text.
- none: No autocomplete (default).`,
            table: { category: apiCategory.attributes }
        },
        dropDownPosition: {
            name: 'position',
            options: [DropdownPosition.above, DropdownPosition.below],
            control: { type: 'select' },
            description: dropdownPositionDescription({
                componentName: 'combobox'
            }),
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' },
            description: appearanceDescription({ componentName: 'combobox' }),
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'combobox' }),
            table: { category: apiCategory.attributes }
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription,
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            name: 'error-visible',
            description: errorVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description: placeholderDescription({ componentName: 'combobox' }),
            table: { category: apiCategory.attributes }
        },
        optionsType: {
            name: 'default',
            description: optionsDescription({ includeGrouping: false }),
            options: Object.values(ExampleOptionsType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleOptionsType.simpleOptions]: 'Simple options',
                    [ExampleOptionsType.wideOptions]: 'Wide options',
                    [ExampleOptionsType.manyOptions]: 'Many options'
                }
            },
            table: { category: apiCategory.slots }
        },
        change: {
            description:
                'Emitted when the user changes the selected option, either by selecting an item from the dropdown or by committing a typed value.',
            table: { category: apiCategory.events },
            control: false
        },
        input: {
            description:
                'Emitted when the user types in the combobox. Use this event if you need to update the list of options based on the text input.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'Combobox',
        disabled: false,
        dropDownPosition: 'below',
        autocomplete: ComboboxAutocomplete.both,
        errorVisible: false,
        errorText: 'Value is invalid',
        appearance: DropdownAppearance.underline,
        placeholder: 'Select value...',
        optionsType: ExampleOptionsType.simpleOptions
    }
};

export default metadata;

export const underlineCombobox: StoryObj<ComboboxArgs> = {
    args: { appearance: DropdownAppearance.underline }
};

export const outlineCombobox: StoryObj<ComboboxArgs> = {
    args: { appearance: DropdownAppearance.outline }
};

export const blockCombobox: StoryObj<ComboboxArgs> = {
    args: { appearance: DropdownAppearance.block }
};
