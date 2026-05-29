import { html, when } from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import {
    controlSlimHeight
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    scssPropertyFromTokenName,
    scssPropertySetterMarkdown,
    tokenNames
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory,
    disabledDescription,
    disableStorybookZoomTransform
} from '../../utilities/storybook';

const chipSize = {
    default: null,
    small: `height: var(${controlSlimHeight.cssCustomProperty});`
} as const;

interface ChipArgs {
    appearance: keyof typeof ChipAppearance;
    size: keyof typeof chipSize;
    removable: boolean;
    content: string;
    icon: boolean;
    disabled?: boolean;
    remove: undefined;
}

const metadata: Meta<ChipArgs> = {
    title: 'Components/Chip',
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
        <${chipTag} appearance="${x => x.appearance}" style="${x => chipSize[x.size]}" ?removable="${x => x.removable}" ?disabled="${x => x.disabled}">
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
        size: {
            name: 'Chip sizing',
            description:
                '<p>Size of the chip component.</p><details><summary>Usage details</summary>To customize its size, set its CSS '
                + '<span style="font-family: monospace;">height</span> to a design token.<br/><ul>'
                + `<li>For Default (32px): No additional styling needed (uses <span style="font-family: monospace;">${scssPropertyFromTokenName(
                    tokenNames.controlHeight
                )}</span>).
                </li>`
                + `<li>For Small (24px): ${scssPropertySetterMarkdown(
                    tokenNames.controlSlimHeight,
                    'height'
                )}
                </li></ul></details>`,
            options: Object.keys(chipSize),
            table: { category: apiCategory.styles },
            control: {
                type: 'radio',
                labels: {
                    default: `Default - 32px - ${scssPropertyFromTokenName(
                        tokenNames.controlHeight
                    )}`,
                    small: `Small - 24px - ${scssPropertyFromTokenName(
                        tokenNames.controlSlimHeight
                    )}`
                }
            }
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
            description: 'Emitted when the user presses the remove button.',
            table: { category: apiCategory.events },
            control: false
        },
    },
    args: {
        appearance: 'outline',
        size: 'default',
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
