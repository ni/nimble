import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';

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
        ...sharedMatrixParameters(),

        // Spinner animation causes snapshot changes in chromatic
        // See https://github.com/ni/nimble/issues/983
        chromatic: {
            disableSnapshot: true
        }
    }
};

export default metadata;

const sizeStates = [
    ['Small (16x16)', ''],
    ['Medium (32x32)', `height: var(${spinnerMediumHeight.cssCustomProperty})`],
    ['Large (64x64)', `height: var(${spinnerLargeHeight.cssCustomProperty})`]
];
type SizeState = (typeof sizeStates)[number];

const component = ([stateName, state]: SizeState): ViewTemplate => html`
    <span style="color: var(${() => bodyFontColor.cssCustomProperty});">
        ${() => stateName}
    </span>
    <${spinnerTag} style="${() => state}"></${spinnerTag}>
`;

export const spinnerThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [sizeStates])
);

export const hiddenSpinner: StoryFn = createStory(
    hiddenWrapper(html`<${spinnerTag} hidden></${spinnerTag}>`)
);
