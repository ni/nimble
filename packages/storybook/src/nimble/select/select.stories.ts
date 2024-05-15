import { html, repeat, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { FilterMode } from '@ni/nimble-components/dist/esm/select/types';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';

import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
} from '../../utilities/storybook';
import { ExampleOptionsType } from './types';

interface SelectArgs {
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    dropDownPosition: string;
    optionsType: ExampleOptionsType;
    appearance: string;
    filterMode: keyof typeof FilterMode;
    placeholder: boolean;
    grouped: boolean;
    clearable: boolean;
}

interface OptionArgs {
    label: string;
    value: string;
    disabled?: boolean;
}

interface GroupedOptionArgs {
    label: string;
    options: OptionArgs[];
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

const getGroupedOptions = (optionsType: ExampleOptionsType): GroupedOptionArgs[] => {
    let optionsLength = 0;
    if (optionsType === ExampleOptionsType.simpleOptions) {
        optionsLength = simpleOptions.length;
    } else if (optionsType === ExampleOptionsType.wideOptions) {
        optionsLength = wideOptions.length;
    } else {
        optionsLength = manyOptions.length;
    }

    const groupedOptions: GroupedOptionArgs[] = [];
    for (let i = 0; i < optionsLength / 3; i++) {
        groupedOptions.push({
            label: `Group ${i + 1}`,
            options: optionSets[optionsType].slice(i * 3, (i + 1) * 3)
        });
    }

    return groupedOptions;
};

const dropdownPositionDescription = `
The \`dropDownPosition\` attribute controls the position of the dropdown relative to the \`Select\`. The default is \`below\`, which will display the dropdown below the \`Select\`. The \`above\` setting will display the dropdown above the \`Select\`.
`;

const appearanceDescription = `
This attribute affects the appearance of the \`Select\`. The default appearance is \`underline\`, which displays a line beneath the selected value. The \`outline\` appearance displays a border around the entire component. The \`block\` appearance applies a background for the entire component.
`;

const errorTextDescription = `
A message to be displayed when the text field is in the invalid state explaining why the value is invalid.
`;

const filterModeDescription = `
This attribute controls the filtering behavior of the \`Select\`. The default of \`none\` results in a dropdown with no input for filtering. A non-'none' setting results in a search input placed at the top or the bottom of the dropdown when opened (depending on where the popup is shown relative to the component). The \`standard\` setting will perform a case-insensitive and diacritic-insensitive filtering of the available options anywhere within the text of each option. 

It is recommended that if the \`Select\` has 15 or fewer options that you use the \`none\` setting for the \`filter-mode\`.
`;

const placeholderDescription = `
To display placeholder text within the \`Select\` you must provide an option that has the \`disabled\`, \`selected\` and \`hidden\` attributes set. This option will not be available in the dropdown, and its contents will be used as the placeholder text. Note that giving the placeholder an initial \`selected\` state is only necessary to display the placeholder initially. If another option is selected initially the placeholder will be displayed upon clearing the current value.

Any \`Select\` without a default selected option should provide placeholder text. Placeholder text should always follow the pattern "Select [thing(s)]", for example "Select country". Use sentence casing and don't include punctuation at the end of the prompt.
`;

const groupedDescription = `
To group options in a \`Select\`, you can use the \`nimble-list-option-group\` element. This element should be placed within the \`Select\` and contain the \`nimble-list-option\` elements that you want to group. Note that a \`nimble-list-option-group\` placed within another \`nimble-list-option-group\` is not supported. The \`label\` attribute of the \`nimble-list-option-group\` element will be used as the group label. Alternatively, text can be provided next to the \`nimble-list-option-group\` element to serve as the group label.
`;

const clearableDescription = `
When the \`clearable\` attribute is set, a clear button will be displayed in the \`Select\` when a value is selected. Clicking the clear button will clear the selected value and display the placeholder text, if available, or will result in a blank display.
`;

const metadata: Meta<SelectArgs> = {
    title: 'Components/Select',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
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
            ?clearable="${x => x.clearable}"
            position="${x => x.dropDownPosition}"
            appearance="${x => x.appearance}"
            filter-mode="${x => (x.filterMode === 'none' ? undefined : x.filterMode)}"
            style="width: 250px;"
        >
            ${when(x => x.placeholder, html`
                <${listOptionTag}
                    disabled
                    selected
                    hidden>
                    Select an option
                </${listOptionTag}?
            `)}
            ${when(x => x.grouped, html<SelectArgs>`
                ${repeat(x => getGroupedOptions(x.optionsType), html<GroupedOptionArgs>`
                    <${listOptionGroupTag}
                        label="${x => x.label}"
                    >
                        ${repeat(x => x.options, html<OptionArgs>`
                            <${listOptionTag}
                                value="${x => x.value}"
                            >${x => x.label}</${listOptionTag}>
                        `, { positioning: true })}
                    </${listOptionGroupTag}>
                `)}
            `)}
            ${when(x => !x.grouped, html<SelectArgs>`
                ${repeat(x => optionSets[x.optionsType], html<OptionArgs>`
                    <${listOptionTag}
                        value="${x => x.value}"
                        ?disabled="${x => x.disabled}"
                    >
                        ${x => x.label}
                    </${listOptionTag}>
                `)}
            `)}
        </${selectTag}>
    `),
    argTypes: {
        dropDownPosition: {
            options: ['above', 'below'],
            control: { type: 'select' },
            description: dropdownPositionDescription
        },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' },
            description: appearanceDescription
        },
        filterMode: {
            options: Object.keys(FilterMode),
            control: { type: 'radio' },
            name: 'filter-mode',
            description: filterModeDescription
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription
        },
        errorVisible: {
            name: 'error-visible'
        },
        placeholder: {
            name: 'placeholder',
            description: placeholderDescription
        },
        grouped: {
            name: 'grouped',
            description: groupedDescription
        },
        clearable: {
            name: 'clearable',
            description: clearableDescription
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
        optionsType: ExampleOptionsType.simpleOptions,
        placeholder: false,
        grouped: false,
        clearable: false
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
