import { html, when } from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/internal/actions/decorator';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory,
    disabledDescription,
    disableStorybookZoomTransform
} from '../../utilities/storybook';

interface ChipArgs {
    appearance: keyof typeof ChipAppearance;
    removable: boolean;
    content: string;
    icon: boolean;
    disabled?: boolean;
    remove: undefined;
}

// prettier-ignore
const metadata: Meta<ChipArgs> = {
    title: 'Components/Chip',
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
        <${chipTag} appearance="${x => x.appearance}" ?removable="${x => x.removable}" ?start="${x => x.icon}" ?disabled="${x => x.disabled}">
            ${x => x.content}
            ${when(x => x.icon, html`
                <nimble-icon-check slot="start"></nimble-icon-check>
            `)}
        </${chipTag}>
    `),
    argTypes: {
        appearance: {
            description: appearanceDescription({ componentName: 'chip' }),
            options: Object.keys(ChipAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        removable: {
            name: 'removable',
            description: 'When the `removable` attribute is set, a remove button is displayed on the chip. When the remove button is pressed a `remove` event is dispatched. The client application is responsible for performing the actual removal.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            name: 'disabled',
            description: disabledDescription({ componentName: 'chip' }),
            table: { category: apiCategory.attributes },
            control: { type: 'boolean' }
        },
        icon: {
            name: 'start',
            description:
                'Set `slot="start"` to show an icon to the left of the chip content.',
            table: { category: apiCategory.slots }
        },
        content: {
            name: 'default',
            description: 'Text to be displayed inside the chip.',
            table: { category: apiCategory.slots }
        },
        remove: {
            description: 'Emitted when the user presses the remove button.',
            table: { category: apiCategory.events },
            control: false
        },
    },
    args: {
        appearance: 'outline',
        removable: false,
        content: 'Homer Simpson',
        icon: false,
        disabled: false
    }
};

export default metadata;

export const chip: StoryObj<ChipArgs> = {
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['remove']
        }
    }
};
