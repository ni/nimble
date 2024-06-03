import { html, repeat, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { selectTag } from '../../../../nimble-components/src/select';
import { FilterMode } from '../../../../nimble-components/src/select/types';
import { ExampleOptionsType } from '../../../../nimble-components/src/select/tests/types';
import { DropdownAppearance } from '../../../../nimble-components/src/patterns/dropdown/types';

import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    disabledDescription,
    dropdownPositionDescription,
    errorTextDescription,
    errorVisibleDescription,
    optionsDescription
} from '../../utilities/storybook';

interface SelectArgs {
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    dropDownPosition: string;
    optionsType: ExampleOptionsType;
    appearance: string;
    filterMode: keyof typeof FilterMode;
    placeholder: boolean;
    clearable: boolean;
    change: undefined;
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
Controls the filtering behavior of the select. The default of \`none\` results in a dropdown with no input for filtering. A non-'none' setting results in a search input placed at the top or the bottom of the dropdown when opened (depending on where the dropdown is shown relative to the component). The \`standard\` setting will perform a case-insensitive and diacritic-insensitive filtering of the available options anywhere within the text of each option. 

It is recommended that if the select has 15 or fewer options that you use the \`none\` setting for the \`filter-mode\`.
`;

const placeholderDescription = `
To display placeholder text within the select you must provide an option that has the \`disabled\`, \`selected\` and \`hidden\` attributes set. This option will not be available in the dropdown, and its contents will be used as the placeholder text. Note that giving the placeholder an initial \`selected\` state is only necessary to display the placeholder initially. If another option is selected initially the placeholder will be displayed upon clearing the current value.

Any select without a default selected option should provide placeholder text. Placeholder text should always follow the pattern "Select [thing(s)]", for example "Select country". Use sentence casing and don't include punctuation at the end of the prompt.
`;

const clearableDescription = `
When the \`clearable\` attribute is set, a clear button will be displayed in the select when a value is selected. Clicking the clear button will clear the selected value and display the placeholder text, if available, or will result in a blank display.
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
            name: 'position',
            options: ['above', 'below'],
            control: { type: 'select' },
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
            name: 'placeholder',
            description: placeholderDescription
            // TODO: move this to a list-option story or create a table category to indicate there isn't a single 'placeholder' attribute
        },
        clearable: {
            name: 'clearable',
            description: clearableDescription,
            table: { category: apiCategory.attributes }
        },
        optionsType: {
            name: 'default',
            description: optionsDescription,
            options: Object.values(ExampleOptionsType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleOptionsType.simpleOptions]: 'Simple options',
                    [ExampleOptionsType.manyOptions]: 'Many options',
                    [ExampleOptionsType.wideOptions]: 'Wide options'
                }
            },
            table: { category: apiCategory.slots }
        },
        change: {
            description: 'Emitted when the user changes the selected option.',
            table: { category: apiCategory.events },
            control: false
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
