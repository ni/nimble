import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvSplitButtonTag } from '@ni/ok-components/dist/esm/fv/split-button';
import {
    FvSplitButtonAppearance,
    FvSplitButtonAppearanceVariant
} from '@ni/ok-components/dist/esm/fv/split-button/types';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    okWarning
} from '../../../utilities/storybook';

interface FvSplitButtonArgs {
    label: string;
    appearance: keyof typeof FvSplitButtonAppearance;
    appearanceVariant: keyof typeof FvSplitButtonAppearanceVariant;
    disabled: boolean;
    trigger?: (e: Event) => void;
    toggle?: (e: Event) => void;
    change?: (e: Event) => void;
}

const metadata: Meta<FvSplitButtonArgs> = {
    title: 'Ok/Fv Split Button',
    render: createUserSelectedThemeStory(html<FvSplitButtonArgs>`
        ${okWarning({
            componentName: 'fv split button',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <div style="padding: 16px; min-height: 220px;">
            <${fvSplitButtonTag}
                label="${x => x.label}"
                appearance="${x => FvSplitButtonAppearance[x.appearance]}"
                appearance-variant="${x => FvSplitButtonAppearanceVariant[x.appearanceVariant]}"
                :disabled="${x => x.disabled}"
            >
                <${menuTag} slot="menu" style="max-height: 116px; overflow-y: auto; width: 112px;">
                    <${menuItemTag}>Open item</${menuItemTag}>
                    <${menuItemTag}>Create copy</${menuItemTag}>
                    <${menuItemTag}>Move to queue</${menuItemTag}>
                    <${menuItemTag}>Review details</${menuItemTag}>
                    <${menuItemTag}>Archive selection</${menuItemTag}>
                </${menuTag}>
            </${fvSplitButtonTag}>
        </div>
    `),
    argTypes: {
        label: {
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.keys(FvSplitButtonAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(FvSplitButtonAppearanceVariant),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'split button' }),
            table: { category: apiCategory.attributes }
        },
        trigger: {
            table: { category: apiCategory.events },
            control: false
        },
        toggle: {
            table: { category: apiCategory.events },
            control: false
        },
        change: {
            description: 'Event emitted when the slotted nimble-menu selection changes.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'Run action',
        appearance: 'outline',
        appearanceVariant: 'default',
        disabled: false
    }
};

export default metadata;

export const fvSplitButton: StoryObj<FvSplitButtonArgs> = {};