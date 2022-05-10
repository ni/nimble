import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor
} from '../../theme-provider/design-tokens';

interface AnchoredRegionArgs {
    horizontalPosition: string;
    verticalPosition: string;
}

const overviewText = `The anchored region should not generally be used directly by nimble clients. Instead, it is intended to be used within other nimble
components where one part of the component needs to be dynamically positioned based on another element within the component. For example, the popup menu
within a menu button or a tooltip.

An anchored region is a container component which enables authors to create layouts where the contents of the anchored region can be positioned relative
to another "anchor" element. Additionally, the anchored region can react to the available space between the anchor and a parent
["viewport"](https://developer.mozilla.org/en-US/docs/Glossary/viewport) element such that the region is placed on the side of the anchor with the most
available space, or even resize itself based on that space.`;

const metadata: Meta<AnchoredRegionArgs> = {
    title: 'Tests/Anchored Region',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<AnchoredRegionArgs>`
        <style>
            .container {
                height: 300px;
            }

            .anchor {
                position: absolute;
                top: 100px;
                left: 300px;
                width: 150px;
                height: 150px;
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
                border: 2px solid var(${borderHoverColor.cssCustomProperty});
                background: var(${applicationBackgroundColor.cssCustomProperty});
            }

            .anchoredRegion {
                width: 75px;
                height: 75px;
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
                border: 2px solid var(${borderHoverColor.cssCustomProperty});
                background: var(${applicationBackgroundColor.cssCustomProperty});
            }
        </style>
        <div class="container">
            <div id="${x => `${x.verticalPosition}_${x.horizontalPosition}`}" class="anchor">
                Anchor element
            </div>
            <nimble-anchored-region
                anchor="${x => `${x.verticalPosition}_${x.horizontalPosition}`}"
                fixed-placement="true"
                auto-update-mode="auto"
                vertical-default-position="${x => x.verticalPosition}"
                vertical-positioning-mode="${x => (x.verticalPosition === 'unset' ? 'dynamic' : 'locktodefault')}"
                horizontal-default-position="${x => x.horizontalPosition}"
                horizontal-positioning-mode="${x => (x.horizontalPosition === 'unset' ? 'dynamic' : 'locktodefault')}"
            >
                <div class="anchoredRegion">
                    Anchored region
                </div>
            </nimble-anchored-region>
        </div>
    `),
    argTypes: {
        horizontalPosition: {
            options: ['start', 'end', 'left', 'right', 'center', 'unset'],
            control: { type: 'select' }
        },
        verticalPosition: {
            options: ['top', 'bottom', 'center', 'unset'],
            control: { type: 'select' }
        }
    },
    args: {}
};

export default metadata;

export const anchoredRegion: StoryObj<AnchoredRegionArgs> = {
    args: {
        horizontalPosition: 'start',
        verticalPosition: 'top'
    }
};
