import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { ComboboxAutocomplete } from '@microsoft/fast-foundation';
import '../../all-components';
import '../../list-option';
import { html, repeat } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    DropdownAppearance,
    DropdownPosition
} from '../../patterns/dropdown/types';

interface ComboboxArgs {
    disabled: boolean;
    dropDownPosition: DropdownPosition;
    autocomplete: ComboboxAutocomplete;
    options: OptionArgs[];
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

const metadata: Meta<ComboboxArgs> = {
    title: 'Combobox',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: `Combobox is a list in which the current value is displayed in the element. Upon clicking on the element, the other options are visible. The user can enter aribtrary values in the input area. 
                     The combobox provides 'autocomplete' options that help finding and selecting a particular value. The value of the combobox comes from the text content of the selected list-option, or, if no matching
                     list option is found, the user-entered text. Whereas with the \`nimble-select\` component, the value property of the list-option is always used for its value.`
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bd6755d9-8fd2-4b97-9709-939ea20680ae/specs/'
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-combobox
            autocomplete="${x => x.autocomplete}"
            ?disabled="${x => x.disabled}"
            position="${x => x.dropDownPosition}"
            error-text="${x => x.errorText}"
            ?error-visible="${x => x.errorVisible}"
            appearance="${x => x.appearance}"
            value="${x => x.currentValue}"
            placeholder="${x => x.placeholder}"
        >
            ${repeat(x => x.options, html<OptionArgs>`
                <nimble-list-option ?disabled="${x => x.disabled}">${x => x.label}</nimble-list-option>
            `)}
        </nimble-combobox>
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
        options: [
            { label: 'Mary', disabled: false },
            { label: 'Sue', disabled: false },
            { label: 'Joaquin', disabled: false },
            { label: 'Frank', disabled: false },
            { label: 'Dracula', disabled: true },
            { label: 'Albert', disabled: false },
            { label: 'Sue Ann', disabled: false }
        ]
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
