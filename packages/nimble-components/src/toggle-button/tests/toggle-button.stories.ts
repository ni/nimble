import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';

import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { ButtonAppearance } from '../types';
import {
    contentHiddenDescription,
    endIconDescription,
    iconDescription
} from '../../patterns/button/tests/doc-strings';
import { toggleButtonTag } from '..';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { iconKeyTag } from '../../icons/key';

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

const metadata: Meta<ToggleButtonArgs> = {
    title: 'Toggle Button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
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
        contentHidden: {
            description: contentHiddenDescription
        },
        icon: {
            description: iconDescription
        },
        endIcon: {
            description: endIconDescription
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${toggleButtonTag}
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
            ?content-hidden="${x => x.contentHidden}"
            appearance="${x => x.appearance}"
        >
            ${when(x => x.icon, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${x => x.label}
            ${when(x => x.endIcon, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
        </${toggleButtonTag}>
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
        appearance: ButtonAppearance.outline
    }
};
export const ghostButton: StoryObj<ToggleButtonArgs> = {
    args: { label: 'Ghost Toggle Button', appearance: ButtonAppearance.ghost }
};
export const blockButton: StoryObj<ToggleButtonArgs> = {
    args: { label: 'Block Toggle Button', appearance: ButtonAppearance.block }
};
export const iconButton: StoryObj<ToggleButtonArgs> = {
    args: {
        label: 'Icon Toggle Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
