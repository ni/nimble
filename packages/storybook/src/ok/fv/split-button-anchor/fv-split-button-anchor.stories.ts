import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvSplitButtonAnchorTag } from '@ni/ok-components/dist/esm/fv/split-button-anchor';
import {
    FvSplitButtonAnchorAppearance,
    FvSplitButtonAnchorAppearanceVariant
} from '@ni/ok-components/dist/esm/fv/split-button-anchor/types';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    okWarning
} from '../../../utilities/storybook';

interface FvSplitButtonAnchorArgs {
    label: string;
    href: string;
    target: string;
    appearance: keyof typeof FvSplitButtonAnchorAppearance;
    appearanceVariant: keyof typeof FvSplitButtonAnchorAppearanceVariant;
    disabled: boolean;
    trigger?: (e: Event) => void;
    toggle?: (e: Event) => void;
    change?: (e: Event) => void;
}

const metadata: Meta<FvSplitButtonAnchorArgs> = {
    title: 'Ok/Fv Split Button Anchor',
    render: createUserSelectedThemeStory(html<FvSplitButtonAnchorArgs>`
        ${okWarning({
            componentName: 'fv split button anchor',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <${fvSplitButtonAnchorTag}
            label="${x => x.label}"
            href="${x => x.href}"
            target="${x => x.target}"
            appearance="${x => FvSplitButtonAnchorAppearance[x.appearance]}"
            appearance-variant="${x => FvSplitButtonAnchorAppearanceVariant[x.appearanceVariant]}"
            :disabled="${x => x.disabled}"
        >
            <${menuTag} slot="menu" style="max-height: 116px; overflow-y: auto; width: 112px;">
                <${menuItemTag}>Open item</${menuItemTag}>
                <${menuItemTag}>Open in new tab</${menuItemTag}>
                <${menuItemTag}>Copy link</${menuItemTag}>
            </${menuTag}>
        </${fvSplitButtonAnchorTag}>
    `),
    argTypes: {
        label: {
            table: { category: apiCategory.attributes }
        },
        href: {
            table: { category: apiCategory.attributes }
        },
        target: {
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.keys(FvSplitButtonAnchorAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(FvSplitButtonAnchorAppearanceVariant),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'split button anchor' }),
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
        label: 'Open report',
        href: 'https://example.com/report',
        target: '_blank',
        appearance: 'outline',
        appearanceVariant: 'default',
        disabled: false
    }
};

export default metadata;

export const fvSplitButtonAnchor: StoryObj<FvSplitButtonAnchorArgs> = {};