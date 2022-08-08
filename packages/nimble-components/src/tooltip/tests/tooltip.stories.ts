import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import type { AutoUpdateMode } from '@microsoft/fast-foundation';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import {
    borderColor,
    bodyFont,
    bodyFontColor
} from '../../theme-provider/design-tokens';
import { TooltipAppearance } from '../types';

interface TooltipArgs {
    visible: boolean;
    appearance: keyof typeof TooltipAppearance;
    delay: number;
    value: string;
    autoUpdateMode: AutoUpdateMode;
    iconVisible: boolean;
}

const metadata: Meta<TooltipArgs> = {
    title: 'Tooltip',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    '<b>Experimental - The tooltip is still in development. It will be ready for app use soon.</b>Per [W3C](https://w3c.github.io/aria-practices/#tooltip) – A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. <br><br> It is recommended to set up aria-describedby, an accessibility feature that sets the description of another element through ID references. To do this, the anchor element (button, text, icon, etc.) of the tooltip must have `aria-describedby= name` in its attributes. To call it, use `id= name` in the nimble-tooltip attributes. More information can be found in the [aria-describedby docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby).'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/'
        },
        actions: {
            handles: ['dismiss']
        }
    },
    render: createUserSelectedThemeStory(html<TooltipArgs>`
        <style class="code-hide">
            .container {
                width: 100px;
                height: 50px;
            }

            #myanchor {
                border: 1px solid var(${borderColor.cssCustomProperty});
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
            }
        </style>
        <div class="container">
            <div
                id="myanchor"
                aria-describedby="mytooltip"
            >
                Text, Button, Icon, etc.
            </div>
            <nimble-tooltip
                id="mytooltip"
                anchor="myanchor"
                ?visible="${x => x.visible}"
                delay="${x => x.delay}"
                auto-update-mode="${x => x.autoUpdateMode}"
                appearance="${x => TooltipAppearance[x.appearance]}"
                ?icon-visible="${x => x.iconVisible}"
            >
                ${x => x.value}
            </nimble-tooltip>
        </div>
    `),
    args: {
        visible: false,
        appearance: 'default',
        iconVisible: false,
        value: 'Tooltip label',
        delay: 300,
        autoUpdateMode: 'anchor'
    },
    argTypes: {
        autoUpdateMode: {
            options: { anchor: 'anchor', auto: 'auto' },
            control: { type: 'radio' },
            description:
                'Controls when the tooltip updates its position. The default is `anchor`, which only updates when the anchor is resized. `auto` will update on scroll/resize events.'
        },
        delay: {
            description:
                'The delay in milliseconds before a tooltip is shown after a hover event'
        },
        appearance: {
            options: Object.keys(TooltipAppearance),
            control: { type: 'radio' },
        }
    }
};

export default metadata;

export const tooltip: StoryObj<TooltipArgs> = {};
