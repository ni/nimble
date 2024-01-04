import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { ButtonAppearance, ButtonAppearanceVariant } from '../types';
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
import { buttonTag } from '..';
import { iconKeyTag } from '../../icons/key';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { bodyFont } from '../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Button',
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
    <${buttonTag}
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${buttonTag}>
`;

export const buttonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        appearanceVariantStates,
        partVisibilityStates
    ])
);

export const hiddenButton: StoryFn = createStory(
    hiddenWrapper(html`<${buttonTag} hidden>Hidden Button</${buttonTag}>`)
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${buttonTag}>Button</${buttonTag}>`)
);

// The baseline of the elements should be aligned when positioned inline.
export const inlineAlignment: StoryFn = createStory(
    html`<span style="font: var(${bodyFont.cssCustomProperty});">
        <span style="text-decoration: underline;">Text</span>
        <${buttonTag}>
            <span style="text-decoration: underline;">Button</span>
        </${buttonTag}>
        <span style="text-decoration: underline;">Text</span>
        <${buttonTag}>
            <${iconKeyTag} slot="start"></${iconKeyTag}>
            <span style="text-decoration: underline;">Button</span>
        </${buttonTag}>
        <div
            style="display:inline-block; width:50px; height:50px; border: 1px black solid;"
        ></div>
    </span>`
);
