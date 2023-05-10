import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { ButtonAppearance, ButtonAppearanceVariant } from '../types';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription
} from '../../patterns/button/tests/doc-strings';
import { buttonTag } from '..';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { iconKeyTag } from '../../icons/key';

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
a dialog is to append "…" (ellipsis) to the button label, e.g., "Save as…".

If you want a button that triggers navigation to a URL, use the \`nimble-anchor-button\` instead.`;

const metadata: Meta<ButtonArgs> = {
    title: 'Components/Button',
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
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

export const outlineButton: StoryObj<ButtonArgs> = {
    args: { label: 'Outline Button', appearance: ButtonAppearance.outline }
};

export const ghostButton: StoryObj<ButtonArgs> = {
    args: { label: 'Ghost Button', appearance: ButtonAppearance.ghost }
};
export const blockButton: StoryObj<ButtonArgs> = {
    args: { label: 'Block Button', appearance: ButtonAppearance.block }
};
export const primaryBlockButton: StoryObj<ButtonArgs> = {
    args: {
        label: 'Primary Block Button',
        appearance: ButtonAppearance.block,
        appearanceVariant: ButtonAppearanceVariant.primary
    }
};
export const iconButton: StoryObj<ButtonArgs> = {
    args: {
        label: 'Icon Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
