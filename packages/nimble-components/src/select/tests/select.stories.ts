import { html, repeat } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
} from '../../utilities/tests/storybook';
import { DropdownAppearance } from '../../patterns/dropdown/types';
import { selectTag } from '..';
import { listOptionTag } from '../../list-option';
import { ExampleOptionsType } from './types';

interface SelectArgs {
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    dropDownPosition: string;
    optionsType: ExampleOptionsType;
    appearance: string;
}

interface OptionArgs {
    label: string;
    value: string;
    disabled: boolean;
}

const simpleOptions: readonly OptionArgs[] = [
    { label: 'Option 1', value: '1', disabled: false },
    { label: 'Option 2', value: '2', disabled: true },
    { label: 'Option 3', value: '3', disabled: false },
    { label: 'Option 4', value: '4', disabled: false }
] as const;

const wideOptions: readonly OptionArgs[] = [
    {
        label: 'Option 1 that is too long to fit in the drop down width',
        value: '1',
        disabled: false
    },
    {
        label: 'Option 2 that is also too long but disabled',
        value: '2',
        disabled: true
    },
    { label: 'Short', value: '3', disabled: false }
] as const;

const longOptions: OptionArgs[] = [];
for (let i = 0; i < 100; i++) {
    longOptions.push({
        label: `Option ${i}`,
        value: `${i}`,
        disabled: false
    });
}

const optionSets = {
    [ExampleOptionsType.simpleOptions]: simpleOptions,
    [ExampleOptionsType.wideOptions]: wideOptions,
    [ExampleOptionsType.longOptions]: longOptions
} as const;

const metadata: Meta<SelectArgs> = {
    title: 'Components/Select',
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
        },
        toolbar: {
            zoom: { hidden: true }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        ${disableStorybookZoomTransform}
        <${selectTag}
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
            ?disabled="${x => x.disabled}"
            position="${x => x.dropDownPosition}"
            appearance="${x => x.appearance}"
            style="width: 250px;"
        >
            ${repeat(x => optionSets[x.optionsType], html<OptionArgs>`
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
        errorVisible: false,
        errorText: 'Value is invalid',
        dropDownPosition: 'below',
        appearance: DropdownAppearance.underline,
        optionsType: ExampleOptionsType.simpleOptions
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
