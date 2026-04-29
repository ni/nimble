import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvChipSelectorTag } from '@ni/ok-components/dist/esm/fv/chip-selector';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../../utilities/storybook';

interface FvChipSelectorArgs {
    label: string;
    options: string;
    selectedValues: string;
    placeholder: string;
    allowCustomValues: boolean;
    disabled: boolean;
    open: boolean;
    change?: (e: Event) => void;
}

const metadata: Meta<FvChipSelectorArgs> = {
    title: 'Ok/Fv Chip Selector',
    parameters: {
        docs: {
            story: {
                height: '200px'
            }
        }
    },
    render: createUserSelectedThemeStory(html<FvChipSelectorArgs>`
        <${fvChipSelectorTag}
            label="${x => x.label}"
            options="${x => x.options}"
            selected-values="${x => x.selectedValues}"
            placeholder="${x => x.placeholder}"
            ?allow-custom-values="${x => x.allowCustomValues}"
            ?disabled="${x => x.disabled}"
            ?open="${x => x.open}"
        ></${fvChipSelectorTag}>
    `),
    argTypes: {
        label: {
            table: { category: apiCategory.attributes }
        },
        options: {
            table: { category: apiCategory.attributes }
        },
        selectedValues: {
            name: 'selected-values',
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            table: { category: apiCategory.attributes }
        },
        allowCustomValues: {
            name: 'allow-custom-values',
            description: 'Allows entering values that are not present in the options list by showing an explicit add action in the menu.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'chip selector' }),
            table: { category: apiCategory.attributes }
        },
        open: {
            table: { category: apiCategory.attributes }
        },
        change: {
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'Label',
        options: 'Red,Yellow,Orange,Blue,Purple,Violet,Pink',
        selectedValues: 'Red,Yellow,Orange',
        placeholder: 'Select colors',
        allowCustomValues: false,
        disabled: false,
        open: false
    }
};

export default metadata;

export const fvChipSelector: StoryObj<FvChipSelectorArgs> = {};