import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '../../patterns/button/types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { anchorButtonTag } from '..';
import { iconLinkTag } from '../../icons/link';
import { iconArrowExpanderRightTag } from '../../icons/arrow-expander-right';

const metadata: Meta = {
    title: 'Tests/Anchor Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

/* array of iconVisible, labelVisible, endIconVisible */
const partVisibilityStates = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
] as const;
type PartVisibilityState = (typeof partVisibilityStates)[number];

const appearanceStates: [string, string | undefined][] = Object.entries(
    ButtonAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

const appearanceVariantStates: [string, string | undefined][] = Object.entries(
    ButtonAppearanceVariant
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceVariantState = (typeof appearanceVariantStates)[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <${anchorButtonTag}
        href="https://nimble.ni.dev"
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconLinkTag} slot="start"></${iconLinkTag}>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Link ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderRightTag} slot="end"></${iconArrowExpanderRightTag}>`)}
    </${anchorButtonTag}>
`;

export const anchorButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        appearanceVariantStates,
        partVisibilityStates
    ])
);

export const hiddenAnchorButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${anchorButtonTag} hidden
            >Hidden Anchor Button</${anchorButtonTag}
        >`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${anchorButtonTag}>Anchor Button</${anchorButtonTag}>`
    )
);
