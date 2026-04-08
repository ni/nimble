import { html, when } from '@ni/fast-element';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '@ni/nimble-components/dist/esm/button/types';
import {
    appearanceDescription,
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription,
    textContentDescription
} from '../patterns/button/doc-strings';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';

interface ButtonArgs {
    label: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
    endIcon: boolean;
    click: undefined;
}

const metadata: Meta<ButtonArgs> = {
    title: 'Components/Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['click']
        }
    },
    argTypes: {
        appearance: {
            options: Object.keys(ButtonAppearance),
            control: { type: 'radio' },
            description: appearanceDescription,
            table: { category: apiCategory.attributes }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(ButtonAppearanceVariant),
            control: { type: 'radio' },
            description: appearanceVariantDescription,
            table: { category: apiCategory.attributes }
        },
        contentHidden: {
            name: 'content-hidden',
            description: contentHiddenDescription,
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'button' }),
            table: { category: apiCategory.attributes }
        },
        label: {
            name: 'default',
            description: textContentDescription({ componentName: 'button' }),
            table: { category: apiCategory.slots }
        },
        icon: {
            name: 'start',
            description: iconDescription,
            table: { category: apiCategory.slots }
        },
        endIcon: {
            name: 'end',
            description: endIconDescription,
            table: { category: apiCategory.slots }
        },
        click: {
            description:
                'Event emitted when the button is activated by either keyboard or mouse.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    render: createUserSelectedThemeStory(html`
        <${buttonTag}
            ?disabled="${x => x.disabled}"
            appearance="${x => ButtonAppearance[x.appearance]}"
            appearance-variant="${x => ButtonAppearanceVariant[x.appearanceVariant]}"
            ?content-hidden="${x => x.contentHidden}">
            ${when(x => x.icon, html`
                <${iconKeyTag} slot="start"></${iconKeyTag}>
            `)}
            ${x => x.label}
            ${when(x => x.endIcon, html`
                <${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>
            `)}
        </${buttonTag}>
`),
    args: {
        label: 'Button',
        appearance: 'outline',
        appearanceVariant: 'default',
        icon: false,
        endIcon: false,
        contentHidden: false,
        disabled: false
    }
};

export default metadata;

export const button: StoryObj<ButtonArgs> = {};
