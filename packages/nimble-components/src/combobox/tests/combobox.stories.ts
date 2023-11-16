import { ComboboxAutocomplete } from '@microsoft/fast-foundation';
import { html, repeat } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { listOptionTag } from '../../list-option';
import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
} from '../../utilities/tests/storybook';
import {
    DropdownAppearance,
    DropdownPosition
} from '../../patterns/dropdown/types';
import { comboboxTag } from '..';
import { ExampleOptionsType } from './types';
import { menuMinWidth } from '../../theme-provider/design-tokens';

interface ComboboxArgs {
    disabled: boolean;
    dropDownPosition: DropdownPosition;
    autocomplete: ComboboxAutocomplete;
    optionsType: ExampleOptionsType;
    errorVisible: boolean;
    errorText: string;
    currentValue: string;
    appearance: string;
    placeholder: string;
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
const longOptions: OptionArgs[] = [];
for (let i = 0; i < 100; i++) {
    longOptions.push({
        label: `${names[i % names.length]!} (${i})`,
        disabled: false
    });
}

const optionSets = {
    [ExampleOptionsType.simpleOptions]: simpleOptions,
    [ExampleOptionsType.wideOptions]: wideOptions,
    [ExampleOptionsType.longOptions]: longOptions
} as const;

const metadata: Meta<ComboboxArgs> = {
    title: 'Components/Combobox',
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component: `Per [W3C](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), a combobox is an input widget that has an associated popup. The popup enables users to choose a value for the input from a collection.
                The \`nimble-combobox\` provides 'autocomplete' options that can help a user find and select a particular value. Unlike with the \`nimble-select\` component, the \`nimble-combobox\` allows the user to enter
                arbitrary values in the input area, not just those that exist as autocomplete options.`
            }
        },
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
            style="width: var(${menuMinWidth.cssCustomProperty});"
        >
            ${repeat(x => optionSets[x.optionsType], html<OptionArgs>`
                <${listOptionTag} ?disabled="${x => x.disabled}">${x => x.label}</${listOptionTag}>
            `)}
        </${comboboxTag}>
    `),
    argTypes: {
        autocomplete: {
            options: Object.values(ComboboxAutocomplete),
            control: { type: 'radio' },
            description: `- inline: Automatically matches the first option that matches the start of the entered text.
- list: Filters the dropdown to options that start with the entered text.
- both: Automatically matches and filters list to options that start with the entered text.
- none: No autocomplete (default).`
        },
        dropDownPosition: {
            options: [DropdownPosition.above, DropdownPosition.below],
            control: { type: 'select' }
        },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' }
        },
        errorText: {
            description:
                'A message to be displayed when the text field is in the invalid state explaining why the value is invalid'
        },
        optionsType: {
            name: 'Options',
            options: Object.values(ExampleOptionsType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleOptionsType.simpleOptions]: 'Simple options',
                    [ExampleOptionsType.longOptions]: 'Long options',
                    [ExampleOptionsType.wideOptions]: 'Wide options'
                }
            }
        }
    },
    args: {
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
