import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { ButtonAppearance } from '../types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    InteractionState,
    interactionStates,
    nonInteractionStates,
    disabledInteractionsFilter
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
    [interactionName, interaction]: InteractionState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [openName, open]: OpenState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${menuButtonTag}
        class="${() => interaction}"
        appearance="${() => appearance}"
        ?open="${() => open}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${interactionName} ${openName} ${appearanceName!} Menu Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
    </${menuButtonTag}>
`;

export const menuButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(
        component,
        [
            nonInteractionStates,
            partVisibilityStates,
            openStates,
            disabledStates,
            appearanceStates
        ],
        // Disabled and open is not a valid state
        (
            _interactionState: InteractionState,
            _partVisibilityState: PartVisibilityState,
            openState: OpenState,
            disabledState: DisabledState
        ) => {
            return disabledState[0] !== 'Disabled' || openState[0] !== 'Open';
        }
    )
);

export const menuButtonInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(
        component,
        [
            interactionStates,
            [[false, true, false]],
            openStates,
            disabledStates,
            appearanceStates
        ],
        // Only interaction relevant to disabled controls is hover
        (
            interactionState: InteractionState,
            _partVisibilityState: PartVisibilityState,
            _openState: OpenState,
            disabledState: DisabledState
        ) => {
            return disabledInteractionsFilter(
                interactionState,
                disabledState
            );
        }
    )
);

export const hiddenMenuButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${menuButtonTag} hidden>Hidden Menu Button</${menuButtonTag}>`
    )
);
