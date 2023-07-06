import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { ButtonAppearance, ButtonAppearanceVariant } from '../types';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    appearanceDescription,
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription,
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

If you want a button that triggers navigation to a URL, use the \`nimble-anchor-button\` instead.

<h4>Sizing</h4>
<p> 
    The label button has two sizes: 32px and 24px, while the icon only button has two smaller sizes: 18px and 16px.
</p>
<p>
    32px buttons are the default sized control and should be used first, while 24px buttons should only be used if there's limited space.
    24px buttons should not be used in combination with 32px buttons.

</p>
<p>
    18px buttons are used to nest within controls, as 16px buttons are generally too small. 
    <br/>Icons are drawn within a 16px space and can sometimes consume the full width or height; this leaves no room for visual interaction bounds.  
    Both 16px and 18px buttons are too small for touch interactions.  18’s are 23% larger than 16’s and help increase the hit zone for a cursor.
</p>
<p>
    16px buttons are the bare minimum size to use in the event icons need to vertically stack next to a 32px control.  
    <h5>These should be used very sparingly and only if necessary.</h5>
</p>
<h4>Styling / Theme</h4>
<p>
    Light UI controls are made of  dark attributes and designed to work against bright, light backgrounds. 
</p>
<p>
    Dark UI controls are made of light attributes and designed to work against bold, dark backgrounds. 
</p>
<p>
    Color UI controls are made of monochromatic attributes and designed to work against bold, medium-dark and dark colored backgrounds.
</p>
<h4>-</h4>
<p>
    Use the Color UI version for backgrounds with color (e.g. purple, blue). 
</p>
<p>
    See the usage details for more information on button styling / usage.
</p>

<h4>Accessibility</h4>
<p> 
    Please work with your designer and insure you have a 4.5:1 
    contrast ratio text to background.
</p>
`;

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
            control: { type: 'radio' },
            description: appearanceDescription
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
export const iconButton: StoryObj<ButtonArgs> = {
    args: {
        label: 'Icon Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
