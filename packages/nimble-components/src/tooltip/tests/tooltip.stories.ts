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

interface TooltipArgs {
    delay: number;
    horizontalViewportLock: boolean;
    verticalViewportLock: boolean;
    tooltip: string;
    autoUpdateMode: AutoUpdateMode;
    status: string;
}

const metadata: Meta<TooltipArgs> = {
    title: 'Tooltip',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#tooltip) – A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. It is recommended to set up Aria-describedby for tooltips.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/'
        },
        actions: {
            handles: ['change']
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
            <div class="anchorDiv" id="anchor">Text, Button, Icon, etc.</div>

            <nimble-tooltip
                anchor="anchor"
                delay="${x => x.delay}"
                ?horizontalViewportLock="${x => x.horizontalViewportLock}"
                ?verticalViewportLock="${x => x.verticalViewportLock}"
                auto-Update-Mode="${x => x.autoUpdateMode}"
            >
                ${x => x.tooltip}
            </nimble-tooltip>
        </div>
    `),
    args: {
        tooltip: 'Tooltip label',
        delay: 300,
        horizontalViewportLock: false,
        verticalViewportLock: false
    },
    argTypes: {
        autoUpdateMode: {
            options: { anchor: 'anchor', auto: 'auto' },
            control: { type: 'radio' },
            description:
                'Controls when the tooltip updates its position, default is `anchor` which only updates when the anchor is resized. `auto` will update on scroll/resize events.'
        },
        horizontalViewportLock: {
            description:
                'Controls if the tooltip will always remain fully in the viewport on the horizontal axis'
        },
        verticalViewportLock: {
            description:
                'Controls if the tooltip will always remain fully in the viewport on the vertical axis'
        }
    }
};

export default metadata;

export const tooltip: StoryObj<TooltipArgs> = {};
