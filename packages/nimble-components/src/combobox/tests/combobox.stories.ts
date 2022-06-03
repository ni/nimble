import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { ComboboxAutocomplete } from '@microsoft/fast-foundation';
import '..';
import '../../list-option';
import { html, repeat } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { DropdownPosition } from '../../patterns/dropdown/types';

interface ComboboxArgs {
    disabled: boolean;
    dropDownPosition: DropdownPosition;
    autocomplete: ComboboxAutocomplete;
    options: OptionArgs[];
    invalid: boolean;
    errorText: string;
}

interface OptionArgs {
    label: string;
    value: string;
    disabled: boolean;
}

const metadata: Meta<ComboboxArgs> = {
    title: 'Combobox',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: `Combobox is a list in which the current value is displayed in the element. Upon clicking on the element, the other options are visible. The user can enter aribtrary values in the input area. 
                     The combobox provides 'autocomplete' options that help finding and selecting a particular value. The value of the combobox comes from the text content of the selected list-option, unlike the
                     nimble-select component, which uses the value property of the list-option for its value.`
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bd6755d9-8fd2-4b97-9709-939ea20680ae/specs/'
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-combobox
            autocomplete="${x => x.autocomplete}"
            ?disabled="${x => x.disabled}"
            position="${x => x.dropDownPosition}"
            error-text="${x => x.errorText}"
            class="${x => (x.invalid ? 'invalid' : '')}"
            aria-invalid="${x => x.invalid}"
        >
            ${repeat(x => x.options, html<OptionArgs>`
                <nimble-list-option ?disabled="${x => x.disabled}">${x => x.label}</nimble-list-option>
            `)}
        </nimble-combobox>
    `),
    argTypes: {
        autocomplete: {
            options: Object.values(ComboboxAutocomplete),
            control: { type: 'radio' }
        },
        dropDownPosition: {
            options: [DropdownPosition.above, DropdownPosition.below],
            control: { type: 'select' }
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
        invalid: false,
        errorText: 'Value is invalid',
        options: [
            { label: 'Mary', value: '1', disabled: false },
            { label: 'Sue', value: '2', disabled: false },
            { label: 'Joaquin', value: '3', disabled: false },
            { label: 'Frank', value: '4', disabled: false },
            { label: 'Dracula', value: '5', disabled: true },
            { label: 'Albert', value: '6', disabled: false }
        ]
    }
};

export default metadata;

export const combobox: StoryObj<ComboboxArgs> = {};
