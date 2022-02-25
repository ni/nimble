import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import '../../icons/key';
import { ButtonAppearance } from '../types';

interface ToggleButtonArgs {
    label: string;
    appearance: string;
    checked: boolean;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#button) - A toggle button is a two-state button
that can be either off (not pressed) or on (pressed). For example, a button labeled mute in an audio player could
indicate that sound is muted by setting the pressed state true. Important: it is critical the label on a toggle does
not change when its state changes. In this example, when the pressed state is true, the label remains "Mute" so a
screen reader would say something like "Mute toggle button pressed".`;

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
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/specs'
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
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-toggle-button
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
            ?content-hidden="${x => x.contentHidden}"
            appearance="${x => x.appearance}"
        >
            ${when(x => x.icon, html`<nimble-key-icon slot="start"></nimble-key-icon>`)}
            ${x => x.label}
        </nimble-toggle-button>
    `),
    args: {
        label: 'Ghost Toggle Button',
        appearance: 'ghost',
        checked: true,
        icon: false,
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
