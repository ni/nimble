import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { isChromatic } from '../../utilities/tests/isChromatic';

import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import { createStory } from '../../utilities/tests/storybook';
import {
    bodyFontColor,
    spinnerLargeHeight,
    spinnerMediumHeight
} from '../../theme-provider/design-tokens';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { spinnerTag } from '..';
import { SpinnerAppearance } from '../types';

const appearanceStates = [
    ['Default', SpinnerAppearance.default],
    ['Accent', SpinnerAppearance.accent]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const sizeStates = [
    ['Small (16x16)', ''],
    ['Medium (32x32)', `height: var(${spinnerMediumHeight.cssCustomProperty})`],
    ['Large (64x64)', `height: var(${spinnerLargeHeight.cssCustomProperty})`]
] as const;
type SizeState = (typeof sizeStates)[number];

const metadata: Meta = {
    title: 'Tests/Spinner',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// Disable animation in Chromatic because it intermittently causes shapshot differences
// prettier-ignore
const component = (
    [stateName, state]: SizeState,
    [appearanceName, appearance]: AppearanceState,
): ViewTemplate => html`
    <span style="color: var(${() => bodyFontColor.cssCustomProperty});">
        ${() => stateName}
        ${() => appearanceName}
    </span>
    <${spinnerTag} 
        style="${() => state}; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
        appearance="${() => appearance}"
    >
    </${spinnerTag}>
`;

export const spinnerThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [sizeStates, appearanceStates])
);

export const hiddenSpinner: StoryFn = createStory(
    hiddenWrapper(html`<${spinnerTag} hidden></${spinnerTag}>`)
);
