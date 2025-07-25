import { html, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
} from '../../utilities/storybook';

interface ChipArgs {
    appearance: keyof typeof ChipAppearance;
    preventRemove: boolean;
    content: string;
    start: boolean;
    disabled?: boolean;
}

const metadata: Meta<ChipArgs> = {
    title: 'Components/Chip',
    parameters: {
        actions: {
            handles: ['remove']
        }
    },
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
        <${chipTag} appearance="${x => x.appearance}" ?prevent-remove="${x => x.preventRemove}" ?start="${x => x.start}" ?disabled="${x => x.disabled}">
            ${x => x.content}
            ${when(x => x.start, html`
                <nimble-icon-check slot="start"></nimble-icon-check>
            `)}
        </${chipTag}>
    `),
    argTypes: {
        appearance: {
            options: Object.keys(ChipAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        preventRemove: {
            name: 'prevent-remove',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            name: 'disabled',
            description: 'Whether the chip is disabled.',
            table: { category: apiCategory.attributes },
            control: { type: 'boolean' }
        },
        start: {
            name: 'start',
            description: 'Content to be displayed to the left of the chip content.',
            table: { category: apiCategory.slots }
        },
        content: {
            name: 'default',
            description: 'Content to be displayed inside the chip.',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        appearance: 'outline',
        preventRemove: false,
        content: 'Homer Simpson',
        start: false,
        disabled: false
    }
};

export default metadata;

export const chip: StoryObj<ChipArgs> = {};
