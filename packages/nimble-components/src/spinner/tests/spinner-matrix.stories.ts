import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import isChromatic from 'chromatic/isChromatic';

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

// Disable animation in Chromatic because it intermittently causes shapshot differences
// prettier-ignore
const component = ([stateName, state]: SizeState): ViewTemplate => html`
    <span style="color: var(${() => bodyFontColor.cssCustomProperty});">
        ${() => stateName}
    </span>
    <${spinnerTag} style="${() => state}; ${isChromatic() ? 'animation-play-state:paused' : ''}">
    </${spinnerTag}>
`;

export const spinnerThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [sizeStates])
);

export const hiddenSpinner: StoryFn = createStory(
    hiddenWrapper(html`<${spinnerTag} hidden></${spinnerTag}>`)
);
