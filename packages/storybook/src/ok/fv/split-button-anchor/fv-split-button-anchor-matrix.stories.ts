import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import { iconLinkTag } from '@ni/nimble-components/dist/esm/icons/link';
import { iconArrowExpanderRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
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
    <div style="padding: 12px 18px; width: 800px; min-height: 250px;">
        ${component('outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('ghost', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('accent outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.accent)}
        ${component('', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default, true)}
        ${component('', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default, true)}
        ${component('', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default, true)}
        ${component('accent block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.accent, true)}
    </div>
`);

const iconStates = Object.values(FvSplitButtonAnchorAppearance).flatMap(appearance => Object.values(FvSplitButtonAnchorAppearanceVariant).flatMap(appearanceVariant => [
    {
        appearance, appearanceVariant, start: true, end: false, disabled: false, href: '#', dir: 'ltr'
    },
    {
        appearance, appearanceVariant, start: false, end: true, disabled: false, href: '#', dir: 'ltr'
    },
    {
        appearance, appearanceVariant, start: true, end: true, disabled: true, href: '#', dir: 'ltr'
    },
    {
        appearance, appearanceVariant, start: true, end: true, disabled: false, href: '', dir: 'rtl'
    }
]));

export const iconSlotsThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: grid; grid-template-columns: repeat(4, max-content); gap: 16px; padding: 16px;">
        ${repeat(
            () => iconStates,
            html<typeof iconStates[number]>`
                <${fvSplitButtonAnchorTag}
                    label="Open results"
                    appearance="${x => x.appearance}"
                    appearance-variant="${x => x.appearanceVariant}"
                    ?disabled="${x => x.disabled}"
                    href="${x => x.href}"
                    dir="${x => x.dir}"
                >
                    ${when(x => x.start, html`
                        <${iconLinkTag} slot="start"></${iconLinkTag}>
                    `)}
                    ${when(x => x.end, html`
                        <${iconArrowExpanderRightTag} slot="end"></${iconArrowExpanderRightTag}>
                    `)}
                    ${baseMenu}
                </${fvSplitButtonAnchorTag}>
            `
        )}
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
            hoverActive: [
                ['accent block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.accent]
            ],
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
    <div style="padding: 12px 18px; width: 800px; min-height: 160px;">
        ${component('outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('block', FvSplitButtonAnchorAppearance.block, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('ghost', FvSplitButtonAnchorAppearance.ghost, FvSplitButtonAnchorAppearanceVariant.default)}
        ${component('accent outline', FvSplitButtonAnchorAppearance.outline, FvSplitButtonAnchorAppearanceVariant.accent)}
        </div>
    </div>
`);

openedByInteractionThemeMatrix.play = async ({ step }): Promise<void> => {
    const splitButtonAnchors = Array.from(document.querySelectorAll<HTMLElement & {
        handleToggleClick: () => void
    }>(fvSplitButtonAnchorTag));

    await step('Open each split button anchor menu', async () => {
        splitButtonAnchors.forEach(splitButtonAnchor => {
            splitButtonAnchor.handleToggleClick();
        });
        await waitForUpdatesAsync();
    });
};