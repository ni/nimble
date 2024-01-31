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
import { menuMinWidth } from '../../theme-provider/design-tokens';
import { FilterMode } from '../types';

interface SelectArgs {
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    dropDownPosition: string;
    optionsType: ExampleOptionsType;
    appearance: string;
    filterMode: keyof typeof FilterMode;
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
    { label: 'Option 4', value: '4', disabled: false },
    { label: 'Zürich', value: '5', disabled: false }
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

const manyOptions: OptionArgs[] = [];
for (let i = 0; i < 100; i++) {
    manyOptions.push({
        label: `Option ${i}`,
        value: `${i}`,
        disabled: false
    });
}

const optionSets = {
    [ExampleOptionsType.simpleOptions]: simpleOptions,
    [ExampleOptionsType.wideOptions]: wideOptions,
    [ExampleOptionsType.manyOptions]: manyOptions
} as const;

const filterModeDescription = `
This attribute controls the filtering behavior of the \`Select\`. The default of \`none\` results in a dropdown with no input for filtering. A non-'none' setting results in a search input placed at the top or the bottom of the dropdown when opened (depending on where the popup is shown relative to the component). The \`standard\` setting will perform a case-insensitive and diacritic-insensitive filtering of the available options anywhere within the text of each option. 

The act of filtering will use the \`hidden\` attribute on the options to remove and re-add them to the visible set. Thus, any client-provided \`hidden\` settings of the options will be overridden.

It is recommended that if the \`Select\` has 15 or fewer options that you use the \`none\` setting for the \`filter-mode\`.
`;

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
            filter-mode="${x => (x.filterMode === 'none' ? undefined : x.filterMode)}"
            style="width: var(${menuMinWidth.cssCustomProperty});"
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
        filterMode: {
            options: Object.keys(FilterMode),
            control: { type: 'radio' },
            description: filterModeDescription
        },
        errorText: {
            name: 'error-text'
        },
        errorVisible: {
            name: 'error-visible'
        },
        optionsType: {
            name: 'options',
            options: Object.values(ExampleOptionsType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleOptionsType.simpleOptions]: 'Simple options',
                    [ExampleOptionsType.manyOptions]: 'Many options',
                    [ExampleOptionsType.wideOptions]: 'Wide options'
                }
            }
        }
    },
    args: {
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        filterMode: 'none',
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
