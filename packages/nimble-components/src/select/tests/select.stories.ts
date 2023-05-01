import { html, repeat } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { DropdownAppearance } from '../../patterns/dropdown/types';
import { selectTag } from '..';
import { listOptionTag } from '../../list-option';

interface SelectArgs {
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    dropDownPosition: string;
    options: OptionArgs[];
    appearance: string;
}

interface OptionArgs {
    label: string;
    value: string;
    disabled: boolean;
}

const metadata: Meta<SelectArgs> = {
    title: 'Select',
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component:
                    "Select is a control for selecting amongst a set of options. Its value comes from the `value` of the currently selected `nimble-list-option`, or, if no value exists for that option, the option's content. Upon clicking on the element, the other options are visible. The user cannot manually enter values, and thus the list cannot be filtered."
            }
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${selectTag}
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
            ?disabled="${x => x.disabled}"
            position="${x => x.dropDownPosition}"
            appearance="${x => x.appearance}"
        >
            ${repeat(x => x.options, html<OptionArgs>`
                <${listOptionTag}
                    value="${x => x.value}"
                    ?disabled="${x => x.disabled}"
                >
                    ${x => x.label}
                </${listOptionTag}>
            `)}
        </${selectTag}>
    `),
    argTypes: {
        dropDownPosition: {
            options: ['above', 'below'],
            control: { type: 'select' }
        },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' }
        },
        errorText: {
            name: 'error-text'
        },
        errorVisible: {
            name: 'error-visible'
        }
    },
    args: {
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        dropDownPosition: 'below',
        appearance: DropdownAppearance.underline,
        options: [
            { label: 'Option 1', value: '1', disabled: false },
            { label: 'Option 2', value: '2', disabled: true },
            { label: 'Option 3', value: '3', disabled: false },
            { label: 'Option 4', value: '4', disabled: false },
            { label: 'Option 5', value: '5', disabled: false },
            { label: 'Option 6', value: '6', disabled: false },
            { label: 'Option 7', value: '7', disabled: false },
            { label: 'Option 8', value: '8', disabled: false },
            { label: 'Option 9', value: '9', disabled: false },
            { label: 'Option 10', value: '10', disabled: false },
            { label: 'Option 11', value: '11', disabled: false },
            { label: 'Option 12', value: '12', disabled: false },
            { label: 'Option 13', value: '13', disabled: false },
            { label: 'Option 14', value: '14', disabled: false },
            { label: 'Option 15', value: '15', disabled: false },
            { label: 'Option 16', value: '16', disabled: false },
            { label: 'Option 17', value: '17', disabled: false },
            { label: 'Option 18', value: '18', disabled: false },
            { label: 'Option 19', value: '19', disabled: false },
            { label: 'Option 20', value: '20', disabled: false }
        ]
    }
};

export default metadata;

export const underlineSelect: StoryObj<SelectArgs> = {
    args: { appearance: DropdownAppearance.underline }
};

export const outlineSelect: StoryObj<SelectArgs> = {
    args: { appearance: DropdownAppearance.outline }
};

export const blockSelect: StoryObj<SelectArgs> = {
    args: { appearance: DropdownAppearance.block }
};
