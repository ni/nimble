import { html, repeat, when } from '@ni/fast-element';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { FilterMode } from '@ni/nimble-components/dist/esm/select/types';
import {
    DropdownAppearance,
    DropdownPosition
} from '@ni/nimble-components/dist/esm/patterns/dropdown/types';

import {
    apiCategory,
    appearanceDescription,
    appearanceReadOnlyDescription,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    disabledDescription,
    dropdownPositionDescription,
    errorTextDescription,
    errorVisibleDescription,
    fullBleedDescription,
    optionsDescription,
    requiredVisibleDescription,
    slottedLabelDescription
} from '../../utilities/storybook';
import { ExampleOptionsType } from './types';

interface SelectArgs {
    label: string;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    requiredVisible: boolean;
    dropDownPosition: string;
    optionsType: ExampleOptionsType;
    appearance: string;
    filterMode: keyof typeof FilterMode;
    clearable: boolean;
    loadingVisible: boolean;
    value: string;
    change: undefined;
    filterInput: undefined;
    appearanceReadOnly: boolean;
    fullBleed: boolean;
}

interface OptionArgs {
    label: string;
    value: string;
    selected?: boolean;
    disabled?: boolean;
    hidden?: boolean;
}

interface GroupedOptionArgs {
    label: string;
    content?: undefined;
    hidden?: boolean;
    options: OptionArgs[];
}

const simpleOptions: readonly OptionArgs[] = [
    { label: 'Option 1', value: '1', disabled: false },
    { label: 'Option 2', value: '2', disabled: true },
    { label: 'Option 3', value: '3', disabled: false },
    { label: 'Option 4', value: '4', disabled: false },
    { label: 'Zürich', value: '5', disabled: false }
] as const;

const placeholderOptions: readonly OptionArgs[] = [
    {
        label: 'Select an option',
        value: '0',
        disabled: true,
        hidden: true,
        selected: true
    },
    { label: 'Option 1', value: '1', disabled: false },
    { label: 'Option 2', value: '2', disabled: true },
    { label: 'Option 3', value: '3', disabled: false },
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

const getGroupedOptions = (): GroupedOptionArgs[] => {
    const groupedOptions: GroupedOptionArgs[] = [];
    for (let i = 0; i < manyOptions.length / 3; i++) {
        groupedOptions.push({
            label: `Group ${i + 1}`,
            options: manyOptions.slice(i * 3, (i + 1) * 3)
        });
    }

    return groupedOptions;
};

const optionSets = {
    [ExampleOptionsType.simpleOptions]: simpleOptions,
    [ExampleOptionsType.placeholderOptions]: placeholderOptions,
    [ExampleOptionsType.wideOptions]: wideOptions,
    [ExampleOptionsType.manyOptions]: manyOptions,
    [ExampleOptionsType.groupedOptions]: getGroupedOptions()
} as const;

const filterModeDescription = `
Controls the filtering behavior of the select. The default of \`none\` results in a dropdown with no input for filtering. A non-'none' setting results in a search input placed at the top or the bottom of the dropdown when opened (depending on where the dropdown is shown relative to the component). The \`standard\` setting will perform a case-insensitive and diacritic-insensitive filtering of the available options anywhere within the text of each option. The \`manual\` setting will provide the search input in the dropdown, but performs no filtering of the options. This allows for custom filtering to be implemented by the consuming application.

If it is expected that the select will always have 15 or fewer options then use the \`none\` setting for \`filter-mode\`, otherwise some form of filtering should be enabled.
`;
const clearableDescription = `
When the \`clearable\` attribute is set, a clear button will be displayed in the select when a value is selected. Clicking the clear button will clear the selected value and display the placeholder text, if available, or will result in a blank display.
`;

const loadingVisibleDescription = `
When the \`loading-visible\` attribute is set, a loading spinner will be displayed in the dropdown of the select along with localizable text that defaults to "Loading…". This is useful when the select is loading its options dynamically.
`;

const metadata: Meta<SelectArgs> = {
    title: 'Components/Select',
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
            ?loading-visible="${x => x.loadingVisible}"
            ?required-visible="${x => x.requiredVisible}"
            ?appearance-readonly="${x => x.appearanceReadOnly}"
            ?full-bleed="${x => x.fullBleed}"
            style="width:250px;"
        >
            ${x => x.label}
            ${when(x => x.optionsType === ExampleOptionsType.groupedOptions, html<SelectArgs>`
                ${repeat(_ => getGroupedOptions(), html<GroupedOptionArgs>`
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
            ${when(x => x.optionsType !== ExampleOptionsType.groupedOptions, html<SelectArgs>`
                ${repeat(x => (optionSets[x.optionsType] as OptionArgs[]), html<OptionArgs>`
                    <${listOptionTag}
                        ?disabled="${x => x.disabled}"
                        ?selected="${x => x.selected}"
                        ?hidden="${x => x.hidden}"
                        value="${x => x.value}"
                    >
                        ${x => x.label}
                    </${listOptionTag}>
                `)}
            `)}
        </${selectTag}>
    `),
    argTypes: {
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'select' })}`,
            table: { category: apiCategory.slots }
        },
        dropDownPosition: {
            name: 'position',
            options: [undefined, ...Object.values(DropdownPosition)],
            type: 'string',
            control: {
                type: 'radio',
                labels: {
                    undefined: 'default'
                }
            },
            description: dropdownPositionDescription({
                componentName: 'select'
            }),
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' },
            description: appearanceDescription({ componentName: 'select' }),
            table: { category: apiCategory.attributes }
        },
        fullBleed: {
            name: 'full-bleed',
            description: fullBleedDescription({
                componentName: 'select'
            }),
            table: { category: apiCategory.attributes }
        },
        filterMode: {
            options: Object.keys(FilterMode),
            control: { type: 'radio' },
            name: 'filter-mode',
            description: filterModeDescription,
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'select' }),
            table: { category: apiCategory.attributes }
        },
        appearanceReadOnly: {
            name: 'appearance-readonly',
            description: appearanceReadOnlyDescription({
                componentName: 'select'
            }),
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
        clearable: {
            name: 'clearable',
            description: clearableDescription,
            table: { category: apiCategory.attributes }
        },
        loadingVisible: {
            name: 'loading-visible',
            description: loadingVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        requiredVisible: {
            name: 'required-visible',
            description: requiredVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        value: {
            name: 'value',
            description:
                'The current value of the select. Selecting a new option will update this value.',
            table: { category: apiCategory.nonAttributeProperties },
            control: false
        },
        optionsType: {
            name: 'default',
            description: optionsDescription({ includeGrouping: true }),
            options: Object.values(ExampleOptionsType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleOptionsType.simpleOptions]: 'Simple options',
                    [ExampleOptionsType.placeholderOptions]:
                        'Placeholder options',
                    [ExampleOptionsType.manyOptions]: 'Many options',
                    [ExampleOptionsType.wideOptions]: 'Wide options',
                    [ExampleOptionsType.groupedOptions]: 'Grouped options'
                }
            },
            table: { category: apiCategory.slots }
        },
        change: {
            description: 'Emitted when the user changes the selected option.',
            table: { category: apiCategory.events },
            control: false
        },
        filterInput: {
            name: 'filter-input',
            description: 'Emitted when the user types in the filter input.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'Select',
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        filterMode: 'none',
        dropDownPosition: undefined,
        appearance: DropdownAppearance.underline,
        optionsType: ExampleOptionsType.simpleOptions,
        clearable: false,
        loadingVisible: false,
        requiredVisible: false,
        appearanceReadOnly: false,
        fullBleed: false
    }
};

export default metadata;

export const select: StoryObj<SelectArgs> = {
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change', 'filter-input']
        },
        toolbar: {
            zoom: { hidden: true }
        }
    }
};

export const placeholder: StoryObj<SelectArgs> = {
    args: {
        optionsType: ExampleOptionsType.placeholderOptions,
        clearable: true
    }
};
