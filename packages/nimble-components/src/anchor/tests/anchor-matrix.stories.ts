import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { AnchorAppearance } from '../types';
import { bodyFont } from '../../theme-provider/design-tokens';
import { anchorTag } from '..';
import {
    interactionStates,
    nonInteractionStates,
    type InteractionState,
    disabledInteractionsFilter
} from '../../utilities/tests/states';

const metadata: Meta = {
    title: 'Tests/Anchor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const disabledStates = [
    ['', 'https://nimble.ni.dev'],
    ['Disabled', null]
] as const;
type DisabledState = (typeof disabledStates)[number];

const underlineHiddenStates = [
    ['', false],
    ['Underline Hidden', true]
] as const;
type UnderlineHiddenState = (typeof underlineHiddenStates)[number];

const appearanceStates: [string, string | undefined][] = Object.entries(
    AnchorAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

// prettier-ignore
const component = (
    [interactionName, interaction]: InteractionState,
    [disabledName, href]: DisabledState,
    [underlineHiddenName, underlineHidden]: UnderlineHiddenState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${anchorTag}
        class="${() => interaction}"
        href=${() => href}
        ?underline-hidden="${() => underlineHidden}"
        appearance="${() => appearance}"
        style="margin-right: 8px; margin-bottom: 8px;">
            ${() => `${interactionName} ${underlineHiddenName} ${appearanceName} ${disabledName} Link`}</${anchorTag}>
`;

export const anchorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        nonInteractionStates,
        disabledStates,
        underlineHiddenStates,
        appearanceStates
    ])
);

export const anchorInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(
        component,
        [
            interactionStates,
            disabledStates,
            underlineHiddenStates,
            appearanceStates
        ],
        // A custom DisabledState type is used in this file, so we can't use the shared disabledInteractionsFilter
        (interactionState: InteractionState, disabledState: DisabledState) => {
            return (
                disabledState[0] !== 'Disabled'
                || interactionState[0] === 'Hovered'
            );
        }
    )
);

export const hiddenAnchor: StoryFn = createStory(
    hiddenWrapper(html`<${anchorTag} hidden>Hidden Anchor</${anchorTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${anchorTag}>Link</${anchorTag}>`)
);

export const textWrapping: StoryFn = createStory(
    // prettier-ignore
    html`
    <p style="width: 300px; border: 1px solid black">
        <style>
            * {
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
        Lorem ipsum dolor sit amet, <${anchorTag} href='#'>
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi</${anchorTag}> ut aliquip ex ea commodo consequat.
    </p>
    `
);

export const inlineSpacing: StoryFn = createStory(
    html`<style>
        .inline-link {
            font: var(${bodyFont.cssCustomProperty});
        }
    </style>
    <span class="inline-link">ABC<${anchorTag} href='#'>DEF</${anchorTag}>GHI</span>`
);
