import { html, ref } from '@ni/fast-element';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { selectVirtualizedTag, SelectVirtualized } from '@ni/nimble-components/dist/esm/select-virtualized';
import { FilterMode, type SelectVirtualizedOption } from '@ni/nimble-components/dist/esm/select-virtualized/types';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';

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
    requiredVisibleDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

interface SelectVirtualizedArgs {
    label: string;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    requiredVisible: boolean;
    dropDownPosition: string;
    appearance: string;
    filterMode: keyof typeof FilterMode;
    clearable: boolean;
    loadingVisible: boolean;
    value: string;
    change: undefined;
    filterInput: undefined;
    appearanceReadOnly: boolean;
    fullBleed: boolean;
    selectRef: SelectVirtualized;
    updateOptions: (x: SelectVirtualizedArgs) => void;
}

const options: SelectVirtualizedOption[] = [];
for (let i = 1; i <= 100_000; i++) {
    options.push({
        displayText: `Option ${i}`,
        value: `option-${i}`
    });
}

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

const metadata: Meta<SelectVirtualizedArgs> = {
    title: 'Components/Select (Virtualized)',
    render: createUserSelectedThemeStory(html`
        ${disableStorybookZoomTransform}
        <${selectVirtualizedTag}
            ${ref('selectRef')}
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
            options-unused="${x => x.updateOptions(x)}"
        >
            ${x => x.label}
        </${selectVirtualizedTag}>
        
        <!-- <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>

        
        <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>

        
        <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>

        
        <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>

        
        <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>

        
        <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>

        
        <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>

        
        <${selectVirtualizedTag}
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
        </${selectVirtualizedTag}>-->
    `),
    argTypes: {
        selectRef: {
            table: {
                disable: true
            }
        },
        updateOptions: {
            table: {
                disable: true
            }
        },
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'select-virtualized' })}`,
            table: { category: apiCategory.slots }
        },
        dropDownPosition: {
            name: 'position',
            options: ['above', 'below'],
            control: { type: 'select' },
            description: dropdownPositionDescription({
                componentName: 'select-virtualized'
            }),
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' },
            description: appearanceDescription({ componentName: 'select-virtualized' }),
            table: { category: apiCategory.attributes }
        },
        fullBleed: {
            name: 'full-bleed',
            description: fullBleedDescription({
                componentName: 'select-virtualized'
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
            description: disabledDescription({ componentName: 'select-virtualized' }),
            table: { category: apiCategory.attributes }
        },
        appearanceReadOnly: {
            name: 'appearance-readonly',
            description: appearanceReadOnlyDescription({
                componentName: 'select-virtualized'
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
        dropDownPosition: 'below',
        appearance: DropdownAppearance.underline,
        clearable: false,
        loadingVisible: false,
        requiredVisible: false,
        appearanceReadOnly: false,
        fullBleed: false,
        selectRef: undefined,
        updateOptions: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined(selectVirtualizedTag);
                // x.selectRef.setOptions(options);
                document.querySelectorAll(selectVirtualizedTag).forEach(select => {
                    select.setOptions(options);
                });
            })();
        }
    }
};

export default metadata;

export const select: StoryObj<SelectVirtualizedArgs> = {
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

// select.play = () => {
//     void (async () => {
//         // Safari workaround: the table element instance is made at this point
//         // but doesn't seem to be upgraded to a custom element yet
//         await customElements.whenDefined(selectVirtualizedTag);
//         document.querySelectorAll(selectVirtualizedTag).forEach(select => {
//             select.setOptions(options);
//         });
//     })();
// }
