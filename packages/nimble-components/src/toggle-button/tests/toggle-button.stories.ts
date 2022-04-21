import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createThemeAwareStory } from '../../utilities/tests/storybook';
import { ButtonAppearance } from '../types';
import '../../all-components';

interface ToggleButtonArgs {
    label: string;
    appearance: string;
    checked: boolean;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
    endIcon: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#button) - A toggle button is a two-state button
that can be either off (not pressed) or on (pressed). For example, a button labeled mute in an audio player could
indicate that sound is muted by setting the pressed state true. Important: it is critical the label on a toggle does
not change when its state changes. In this example, when the pressed state is true, the label remains "Mute" so a
screen reader would say something like "Mute toggle button pressed".`;

const endIconDescription = `When including an icon after the text content, set \`slot="end"\` on the icon to ensure proper styling.

This icon will be hidden when \`contentHidden\` is set to \`true\`
.`;

const metadata: Meta<ToggleButtonArgs> = {
    title: 'Toggle Button',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    argTypes: {
        appearance: {
            options: Object.values(ButtonAppearance),
            control: { type: 'radio' }
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
    render: createThemeAwareStory(html`
        <nimble-toggle-button
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
            ?content-hidden="${x => x.contentHidden}"
            appearance="${x => x.appearance}"
        >
            ${when(x => x.icon, html`<nimble-key-icon slot="start"></nimble-key-icon>`)}
            ${x => x.label}
            ${when(x => x.endIcon, html`<nimble-arrow-expander-down-icon slot="end"></nimble-arrow-expander-down-icon>`)}
        </nimble-toggle-button>
    `),
    args: {
        label: 'Ghost Toggle Button',
        appearance: 'ghost',
        checked: true,
        icon: false,
        endIcon: false,
        contentHidden: false,
        disabled: false
    }
};

export default metadata;

export const outlineButton: StoryObj<ToggleButtonArgs> = {
    args: {
        label: 'Outline Toggle Button',
        appearance: ButtonAppearance.Outline
    }
};
export const ghostButton: StoryObj<ToggleButtonArgs> = {
    args: { label: 'Ghost Toggle Button', appearance: ButtonAppearance.Ghost }
};
export const blockButton: StoryObj<ToggleButtonArgs> = {
    args: { label: 'Block Toggle Button', appearance: ButtonAppearance.Block }
};
export const iconButton: StoryObj<ToggleButtonArgs> = {
    args: {
        label: 'Icon Toggle Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.Outline
    }
};
