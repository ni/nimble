import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor
} from '../../theme-provider/design-tokens';
import { anchoredRegionTag } from '..';

interface AnchoredRegionArgs {
    horizontalPosition: string;
    verticalPosition: string;
}

const metadata: Meta<AnchoredRegionArgs> = {
    title: 'Tests/Anchored Region',
    parameters: {},
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
            <${anchoredRegionTag}
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
            </${anchoredRegionTag}>
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
