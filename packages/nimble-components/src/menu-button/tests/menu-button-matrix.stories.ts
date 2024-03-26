import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsfromStates
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    disabledStateIsEnabled
} from '../../utilities/tests/states';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { iconKeyTag } from '../../icons/key';
import { menuButtonTag } from '..';

const metadata: Meta = {
    title: 'Tests/Menu Button',
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
const partVisibilityStatesOnlyLabel = partVisibilityStates[2];

const openStates = [
    ['', false],
    ['Open', true]
] as const;
type OpenState = (typeof openStates)[number];

const appearanceStates = Object.entries(ButtonAppearance).map(
    ([key, value]) => [pascalCase(key), value]
);
type AppearanceState = (typeof appearanceStates)[number];

// prettier-ignore
const component = (
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [disabledName, disabled]: DisabledState,
    [openName, open]: OpenState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${menuButtonTag}
        appearance="${() => appearance}"
        ?open="${() => open}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${openName} ${appearanceName!} Menu Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${menuButtonTag}>
`;

export const menuButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(
        component,
        [
            partVisibilityStates,
            disabledStates,
            openStates,
            appearanceStates
        ]
    )
);

const interactionStatesHover = cartesianProduct([
    [partVisibilityStatesOnlyLabel],
    disabledStates,
    openStates,
    appearanceStates
] as const);

const interactionStates = cartesianProduct([
    [partVisibilityStatesOnlyLabel],
    [disabledStateIsEnabled],
    openStates,
    appearanceStates
] as const);

export const menuButtonInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsfromStates(
        component,
        {
            hover: interactionStatesHover,
            hoverActive: interactionStates,
            active: interactionStates,
            focus: interactionStates,
        }
    )
);

export const hiddenMenuButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${menuButtonTag} hidden>Hidden Menu Button</${menuButtonTag}>`
    )
);
