import { html, when } from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
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
    selectable: boolean;
    selected: boolean;
    removable: boolean;
    content: string;
    icon: boolean;
    disabled?: boolean;
    remove: undefined;
    selectedChange: undefined;
}

const metadata: Meta<ChipArgs> = {
    title: 'Components/Chip',
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
        <${chipTag}
            appearance="${x => x.appearance}"
            ?selectable="${x => x.selectable}"
            ?selected="${x => x.selected}"
            ?removable="${x => x.removable}"
            ?disabled="${x => x.disabled}"
        >
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
        selectable: {
            name: 'selectable',
            description: 'Whether the chip behaves like a toggle button for local selection state.',
            control: { type: 'boolean' },
            table: { category: apiCategory.attributes }
        },
        selected: {
            name: 'selected',
            description: 'Whether the chip is selected. Only affects selectable chips.',
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
                'To show an icon to the left of the chip text, add the icon as child content and set `slot="start"` on it.',
            table: { category: apiCategory.slots }
        },
        content: {
            name: 'default',
            description: 'Text to be displayed inside the chip.',
            table: { category: apiCategory.slots }
        },
        remove: {
            description: 'Emitted when the user presses the remove button or presses Escape on a removable chip.',
            table: { category: apiCategory.events },
            control: false
        },
        selectedChange: {
            name: 'selected-change',
            description: 'Emitted when the user toggles a selectable chip.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        appearance: 'outline',
        selectable: false,
        selected: false,
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
            handles: ['remove', 'selected-change']
        }
    }
};
