import { html, repeat, when } from '@ni/fast-element';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';
import { multiselectTag } from '@ni/nimble-components/dist/esm/multiselect';
import { FilterMode } from '@ni/nimble-components/dist/esm/select/types';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';

import {
    apiCategory,
    appearanceDescription,
    appearanceReadOnlyDescription,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    disabledDescription,
    dropdownPositionDescription,
    requiredVisibleDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

type OptionType = 'simple' | 'placeholder' | 'grouped';

interface MultiselectArgs {
    label: string;
    disabled: boolean;
    requiredVisible: boolean;
    dropDownPosition: string;
    optionsType: OptionType;
    appearance: string;
    filterMode: keyof typeof FilterMode;
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

const simpleOptions: readonly OptionArgs[] = [
    { label: 'Option 1', value: '1', selected: true },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', selected: true },
    { label: 'Zürich', value: '4' }
] as const;

interface GroupedOptionArgs {
    label: string;
    options: OptionArgs[];
}

const getGroupedOptions = (): GroupedOptionArgs[] => [
    {
        label: 'Group A',
        options: [
            { label: 'A1', value: 'a1' },
            { label: 'A2', value: 'a2' }
        ]
    },
    {
        label: 'Group B',
        options: [
            { label: 'B1', value: 'b1' },
            { label: 'B2', value: 'b2' }
        ]
    }
];

const placeholderOptions: readonly OptionArgs[] = [
    {
        label: 'Pick one or more…',
        value: '__placeholder__',
        disabled: true,
        hidden: true
    },
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' }
] as const;

const optionSets = {
    simple: simpleOptions,
    placeholder: placeholderOptions
} as const;

function getOptionSet(optionsType: OptionType): readonly OptionArgs[] {
    if (optionsType === 'grouped') {
        return [] as const;
    }

    return optionSets[optionsType];
}

const metadata: Meta<MultiselectArgs> = {
    title: 'Components/Multi Select',
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        ${disableStorybookZoomTransform}
        <${multiselectTag}
            ?disabled="${x => x.disabled}"
            position="${x => x.dropDownPosition}"
            appearance="${x => x.appearance}"
            filter-mode="${x => (x.filterMode === 'none' ? undefined : x.filterMode)}"
            ?required-visible="${x => x.requiredVisible}"
            ?appearance-readonly="${x => x.appearanceReadOnly}"
            ?full-bleed="${x => x.fullBleed}"
            style="width:300px;"
        >
            ${x => x.label}

            ${when(x => x.optionsType === 'grouped', html<MultiselectArgs>`
                ${repeat(() => getGroupedOptions(), html<GroupedOptionArgs>`
                    <${listOptionGroupTag} label="${x => x.label}">
                        ${repeat(x => x.options, html<OptionArgs>`
                            <${listOptionTag}
                                value="${x => x.value}"
                                ?hidden="${x => x.hidden}"
                                ?disabled="${x => x.disabled}"
                                ?selected="${x => x.selected}"
                            >${x => x.label}</${listOptionTag}>
                        `, { positioning: true })}
                    </${listOptionGroupTag}>
                `)}
            `)}

            ${when(x => x.optionsType !== 'grouped', html<MultiselectArgs>`
                ${repeat(x => getOptionSet(x.optionsType), html<OptionArgs>`
                    <${listOptionTag}
                        value="${x => x.value}"
                        ?hidden="${x => x.hidden}"
                        ?disabled="${x => x.disabled}"
                        ?selected="${x => x.selected}"
                    >${x => x.label}</${listOptionTag}>
                `)}
            `)}

        </${multiselectTag}>
    `),
    argTypes: {
        optionsType: {
            name: 'options-type',
            options: ['simple', 'placeholder', 'grouped'],
            control: { type: 'select' },
            description: 'Controls the type of options displayed',
            table: { category: apiCategory.attributes }
        },
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'multiselect' })}`,
            table: { category: apiCategory.slots }
        },
        dropDownPosition: {
            name: 'position',
            options: ['above', 'below'],
            control: { type: 'select' },
            description: dropdownPositionDescription({
                componentName: 'multiselect'
            }),
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.values(DropdownAppearance),
            control: { type: 'radio' },
            description: appearanceDescription({
                componentName: 'multiselect'
            }),
            table: { category: apiCategory.attributes }
        },
        filterMode: {
            options: Object.keys(FilterMode),
            control: { type: 'radio' },
            name: 'filter-mode',
            description: 'Controls filtering behavior',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'multiselect' }),
            table: { category: apiCategory.attributes }
        },
        appearanceReadOnly: {
            name: 'appearance-readonly',
            description: appearanceReadOnlyDescription({
                componentName: 'multiselect'
            }),
            table: { category: apiCategory.attributes }
        },
        requiredVisible: {
            name: 'required-visible',
            description: requiredVisibleDescription,
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        label: 'Choose options',
        disabled: false,
        filterMode: 'none',
        dropDownPosition: 'below',
        appearance: DropdownAppearance.underline,
        optionsType: 'simple',
        requiredVisible: false,
        appearanceReadOnly: false,
        fullBleed: false
    }
};

export default metadata;

export const multiselect: StoryObj<MultiselectArgs> = {
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: { handles: ['change', 'filter-input'] },
        toolbar: { zoom: { hidden: true } }
    }
};

export const placeholder: StoryObj<MultiselectArgs> = {
    args: {
        optionsType: 'placeholder'
    }
};

export const readonly: StoryObj<MultiselectArgs> = {
    args: {
        disabled: true,
        appearanceReadOnly: true
    }
};
