import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fvSplitButtonAnchorTag } from '@ni/ok-components/dist/esm/fv/split-button-anchor';
import {
    FvSplitButtonAnchorAppearance,
    FvSplitButtonAnchorAppearanceVariant
} from '@ni/ok-components/dist/esm/fv/split-button-anchor/types';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import {
    createMatrixInteractionsFromStates,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Split Button Anchor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const baseMenu = html`
    <${menuTag} slot="menu">
        <${menuItemTag}>Open in current tab</${menuItemTag}>
        <${menuItemTag}>Open in new tab</${menuItemTag}>
        <${menuItemTag}>Copy link</${menuItemTag}>
    </${menuTag}>
`;

const component = (
    label: string,
    appearance: string,
    appearanceVariant: string,
    open = false
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; gap: 12px; margin: 0 20px 28px 0; min-width: 140px;">
        <div style="font-size: 12px; color: #0076d6; text-align: center; min-height: 16px;">
            ${() => label}
        </div>
        <${fvSplitButtonAnchorTag}
            label="Open results"
            href="https://example.com/results"
            target="_blank"
            appearance="${() => FvSplitButtonAnchorAppearance[appearance as keyof typeof FvSplitButtonAnchorAppearance]}"
            appearance-variant="${() => FvSplitButtonAnchorAppearanceVariant[appearanceVariant as keyof typeof FvSplitButtonAnchorAppearanceVariant]}"
            ?open="${() => open}"
        >
            ${baseMenu}
        </${fvSplitButtonAnchorTag}>
    </div>
`;

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="padding: 12px 18px; width: 560px;">
        ${component('outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('ghost', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default, true)}
        ${component('', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default, true)}
        ${component('', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default, true)}
        <div style="margin-top: 20px;">
            ${component('accent outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.accent)}
        </div>
    </div>
`);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(
        (
            label: string,
            appearance: string,
            appearanceVariant: string
        ): ViewTemplate => html`
            <div style="display: inline-flex; flex-direction: column; gap: 12px; margin: 0 20px 20px 0; min-width: 140px;">
                <div style="font-size: 12px; color: #0076d6; text-align: center; min-height: 16px;">
                    ${() => label}
                </div>
                <${fvSplitButtonAnchorTag}
                    label="Open results"
                    href="https://example.com/results"
                    target="_blank"
                    appearance="${() => FvSplitButtonAnchorAppearance[appearance as keyof typeof FvSplitButtonAnchorAppearance]}"
                    appearance-variant="${() => FvSplitButtonAnchorAppearanceVariant[appearanceVariant as keyof typeof FvSplitButtonAnchorAppearanceVariant]}"
                >
                    ${baseMenu}
                </${fvSplitButtonAnchorTag}>
            </div>
        `,
        {
            hover: [
                ['outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default],
                ['block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default],
                ['ghost', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default],
                ['accent outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.accent]
            ],
            hoverActive: [],
            active: [],
            focus: [
                ['outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default],
                ['block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default],
                ['ghost', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default],
                ['accent outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.accent]
            ]
        }
    )
);

export const openedByInteractionThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="padding: 12px 18px; width: 560px;">
        ${component('outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('ghost', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default)}
        <div style="margin-top: 20px;">
            ${component('accent outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.accent)}
        </div>
    </div>
`);

openedByInteractionThemeMatrix.play = async ({ step }): Promise<void> => {
    const splitButtonAnchors = Array.from(document.querySelectorAll<HTMLElement & {
        handleToggleClick: () => void;
    }>(fvSplitButtonAnchorTag));

    await step('Open each split button anchor menu', async () => {
        splitButtonAnchors.forEach(splitButtonAnchor => {
            splitButtonAnchor.handleToggleClick();
        });
        await waitForUpdatesAsync();
    });
};