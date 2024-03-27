import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { iconKeyTag } from '../../icons/key';
import { menuButtonTag } from '..';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';
import {
    appearanceStates,
    type AppearanceState,
    type AppearanceVariantState,
    type PartVisibilityState,
    appearanceVariantStates,
    partVisibilityStates
} from '../../patterns/button/tests/states';

const metadata: Meta = {
    title: 'Tests/Menu Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState,
): ViewTemplate => html`
    <${menuButtonTag}
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Menu Button ${disabledName}`}
            ${when(() => endIconVisible, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}

        <${menuTag} slot="menu">
            <${menuItemTag}>Item 1</${menuItemTag}>
            <${menuItemTag}>Item 2</${menuItemTag}>
        </${menuTag}>
    </${menuButtonTag}>
`;

export const menuButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        partVisibilityStates,
        disabledStates,
        appearanceStates,
        appearanceVariantStates
    ])
);

export const hiddenMenuButton: StoryFn = createStory(
    hiddenWrapper(
        html`<${menuButtonTag} hidden>Hidden Menu Button</${menuButtonTag}>`
    )
);
