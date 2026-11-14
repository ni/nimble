import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import { iconLinkTag } from '@ni/nimble-components/dist/esm/icons/link';
import { iconArrowExpanderRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fvSplitButtonTag } from '@ni/ok-components/dist/esm/fv/split-button';
import {
    FvSplitButtonAppearance,
    FvSplitButtonAppearanceVariant
} from '@ni/ok-components/dist/esm/fv/split-button/types';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import {
    createMatrixInteractionsFromStates,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Split Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const baseMenu = html`
    <${menuTag} slot="menu">
        <${menuItemTag}>Line item 1</${menuItemTag}>
        <${menuItemTag}>Line item 2</${menuItemTag}>
        <${menuItemTag}>Line item 3</${menuItemTag}>
        <${menuItemTag}>Line item 4</${menuItemTag}>
        <${menuItemTag}>Loading...</${menuItemTag}>
    </${menuTag}>
`;

const component = (
    label: string,
    appearance: string,
    appearanceVariant: string,
    open = false
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; gap: 12px; margin: 0 20px 28px 0; min-width: 120px;">
        <div style="font-size: 12px; color: #0076d6; text-align: center; min-height: 16px;">
            ${() => label}
        </div>
        <${fvSplitButtonTag}
            label="Line item 1"
            appearance="${() => FvSplitButtonAppearance[appearance as keyof typeof FvSplitButtonAppearance]}"
            appearance-variant="${() => FvSplitButtonAppearanceVariant[appearanceVariant as keyof typeof FvSplitButtonAppearanceVariant]}"
            ?open="${() => open}"
        >
            ${baseMenu}
        </${fvSplitButtonTag}>
    </div>
`;

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="padding: 12px 18px; width: 700px; min-height: 340px;">
        ${component('outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.default)}
        ${component('block', FvSplitButtonAppearance.block, FvSplitButtonAppearanceVariant.default)}
        ${component('ghost', FvSplitButtonAppearance.ghost, FvSplitButtonAppearanceVariant.default)}
        ${component('accent outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.accent)}
        ${component('', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.default, true)}
        ${component('', FvSplitButtonAppearance.block, FvSplitButtonAppearanceVariant.default, true)}
        ${component('', FvSplitButtonAppearance.ghost, FvSplitButtonAppearanceVariant.default, true)}
    </div>
`);

const iconStates = Object.values(FvSplitButtonAppearance).flatMap(appearance => Object.values(FvSplitButtonAppearanceVariant).flatMap(appearanceVariant => [
    {
        appearance, appearanceVariant, start: true, end: false, disabled: false, dir: 'ltr'
    },
    {
        appearance, appearanceVariant, start: false, end: true, disabled: false, dir: 'ltr'
    },
    {
        appearance, appearanceVariant, start: true, end: true, disabled: true, dir: 'ltr'
    },
    {
        appearance, appearanceVariant, start: true, end: true, disabled: false, dir: 'rtl'
    }
]));

export const iconSlotsThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: grid; grid-template-columns: repeat(4, max-content); gap: 16px; padding: 16px;">
        ${repeat(
            () => iconStates,
            html<typeof iconStates[number]>`
                <${fvSplitButtonTag}
                    label="Run action"
                    appearance="${x => x.appearance}"
                    appearance-variant="${x => x.appearanceVariant}"
                    ?disabled="${x => x.disabled}"
                    dir="${x => x.dir}"
                >
                    ${when(x => x.start, html`
                        <${iconLinkTag} slot="start"></${iconLinkTag}>
                    `)}
                    ${when(x => x.end, html`
                        <${iconArrowExpanderRightTag} slot="end"></${iconArrowExpanderRightTag}>
                    `)}
                    ${baseMenu}
                </${fvSplitButtonTag}>
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
            <div style="display: inline-flex; flex-direction: column; gap: 12px; margin: 0 20px 20px 0; min-width: 120px;">
                <div style="font-size: 12px; color: #0076d6; text-align: center; min-height: 16px;">
                    ${() => label}
                </div>
                <${fvSplitButtonTag}
                    label="Line item 1"
                    appearance="${() => FvSplitButtonAppearance[appearance as keyof typeof FvSplitButtonAppearance]}"
                    appearance-variant="${() => FvSplitButtonAppearanceVariant[appearanceVariant as keyof typeof FvSplitButtonAppearanceVariant]}"
                >
                    ${baseMenu}
                </${fvSplitButtonTag}>
            </div>
        `,
        {
            hover: [
                ['outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.default],
                ['block', FvSplitButtonAppearance.block, FvSplitButtonAppearanceVariant.default],
                ['ghost', FvSplitButtonAppearance.ghost, FvSplitButtonAppearanceVariant.default],
                ['accent outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.accent]
            ],
            hoverActive: [],
            active: [],
            focus: [
                ['outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.default],
                ['block', FvSplitButtonAppearance.block, FvSplitButtonAppearanceVariant.default],
                ['ghost', FvSplitButtonAppearance.ghost, FvSplitButtonAppearanceVariant.default],
                ['accent outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.accent]
            ]
        }
    )
);

export const openedByInteractionThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="padding: 12px 18px; width: 800px; min-height: 220px;">
        ${component('outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.default)}
        ${component('block', FvSplitButtonAppearance.block, FvSplitButtonAppearanceVariant.default)}
        ${component('ghost', FvSplitButtonAppearance.ghost, FvSplitButtonAppearanceVariant.default)}
        ${component('accent outline', FvSplitButtonAppearance.outline, FvSplitButtonAppearanceVariant.accent)}
        </div>
    </div>
`);

openedByInteractionThemeMatrix.play = async ({ step }): Promise<void> => {
    const splitButtons = Array.from(document.querySelectorAll<HTMLElement & {
        handleToggleClick: () => void
    }>(fvSplitButtonTag));

    await step('Open each split button menu', async () => {
        splitButtons.forEach(splitButton => {
            splitButton.handleToggleClick();
        });
        await waitForUpdatesAsync();
    });
};