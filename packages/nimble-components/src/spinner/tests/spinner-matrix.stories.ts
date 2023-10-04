import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { isChromatic } from '../../utilities/tests/isChromatic';

import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    bodyFontColor,
    spinnerLargeHeight,
    spinnerMediumHeight
} from '../../theme-provider/design-tokens';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { spinnerTag } from '..';
import { SpinnerAppearance } from '../types';

const metadata: Meta = {
    title: 'Tests/Spinner',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const sizeStates = [
    ['Small (16x16)', ''],
    ['Medium (32x32)', `height: var(${spinnerMediumHeight.cssCustomProperty})`],
    ['Large (64x64)', `height: var(${spinnerLargeHeight.cssCustomProperty})`]
];
type SizeState = (typeof sizeStates)[number];

const appearanceStates: [string, string | undefined][] = Object.entries(
    SpinnerAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

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
