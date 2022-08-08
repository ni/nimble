import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, when } from '@microsoft/fast-element';
import { ButtonAppearance, ButtonAppearanceVariant } from '../types';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface ButtonArgs {
    label: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
    endIcon: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#button) - A button is a widget that
enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an
action, or performing a delete operation. A common convention for informing users that a button launches
a dialog is to append "…" (ellipsis) to the button label, e.g., "Save as…".`;

const appearanceVariantDescription = `This attribute has no effect on buttons with a \`ghost\` appearance.

<details>
    <summary>Primary Button Usage</summary>
    Make a button primary to distinguish it visibly for one of the following reasons: 
    <ul>
        <li>to indicate the action that allows the user to accomplish their most common or important goal</li>
        <li>to indicate the action that allows the user to complete their task</li>
    </ul>
</details>
`;

const endIconDescription = `When including an icon after the text content, set \`slot="end"\` on the icon to ensure proper styling.

This icon will be hidden when \`contentHidden\` is set to \`true\`
.`;

const metadata: Meta<ButtonArgs> = {
    title: 'Button',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        },
        actions: {
            handles: ['click']
        }
    },
    argTypes: {
        appearance: {
            options: Object.keys(ButtonAppearance),
            control: { type: 'radio' }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(ButtonAppearanceVariant),
            control: { type: 'radio' },
            description: appearanceVariantDescription
        },
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        },
        endIcon: {
            description: endIconDescription
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-button
            ?disabled="${x => x.disabled}"
            appearance="${x => ButtonAppearance[x.appearance]}"
            appearance-variant="${x => ButtonAppearanceVariant[x.appearanceVariant]}"
            ?content-hidden="${x => x.contentHidden}">
            ${when(x => x.icon, html`
                <nimble-icon-key slot="start"></nimble-icon-key>
            `)}
            ${x => x.label}
            ${when(x => x.endIcon, html`
                <nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>
            `)}
        </nimble-button>
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

export const outlineButton: StoryObj<ButtonArgs> = {
    args: { label: 'Outline Button', appearance: ButtonAppearance.outline }
};

export const ghostButton: StoryObj<ButtonArgs> = {
    args: { label: 'Ghost Button', appearance: ButtonAppearance.ghost }
};
export const blockButton: StoryObj<ButtonArgs> = {
    args: { label: 'Block Button', appearance: ButtonAppearance.block }
};
export const iconButton: StoryObj<ButtonArgs> = {
    args: {
        label: 'Icon Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
