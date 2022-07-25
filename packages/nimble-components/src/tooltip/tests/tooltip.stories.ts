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
import { TooltipStatus } from '../types';

interface TooltipArgs {
    visible: boolean;
    state: keyof typeof TooltipStatus;
    delay: number;
    tooltip: string;
    autoUpdateMode: AutoUpdateMode;
    icon: boolean;
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
        <style>
            .container {
                width: 100px;
                height: 50px;
            }

            .anchorDiv {
                border: 1px solid var(${borderColor.cssCustomProperty});
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
            }
        </style>
        <div class="container">
            <div class="anchorDiv" id="anchor" aria-describedby="ariaAnchor">
                Text, Button, Icon, etc.
            </div>
            <nimble-tooltip
                anchor="anchor"
                ?visible="${x => x.visible}"
                delay="${x => x.delay}"
                auto-update-mode="${x => x.autoUpdateMode}"
                id="ariaAnchor"
                class="${x => TooltipStatus[x.state]} ${x => (x.icon ? 'icon-visible' : '')}"
            >
                ${x => x.tooltip}
            </nimble-tooltip>
        </div>
    `),
    args: {
        visible: false,
        state: 'default',
        icon: false,
        tooltip: 'Tooltip label',
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
        state: {
            options: Object.keys(TooltipStatus),
            control: { type: 'radio' },
            description:
                'Set the `default`, `fail`, or `information` CSS class on the tooltip to switch between the theme-aware color options.'
        },
        icon: {
            description:
                'Add the `icon-visible` CSS class to the tooltip to show the icon corresponding to the tooltip state. The `default` state will not show an icon even if `icon-visible` is set.'
        }
    }
};

export default metadata;

export const tooltip: StoryObj<TooltipArgs> = {};
