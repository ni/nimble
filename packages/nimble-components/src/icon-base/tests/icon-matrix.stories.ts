import type { Story, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { IconStatus } from '../types';
import { bodyFontColor } from '../../theme-provider/design-tokens';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Icon',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const iconStatusStates = [
    ['Pass', IconStatus.pass],
    ['Fail', IconStatus.fail],
    ['Warning', IconStatus.warning],
    ['Regular', IconStatus.regular],
    ['Information', IconStatus.information]
] as const;
type IconStatusState = typeof iconStatusStates[number];

const component = ([stateName, state]: IconStatusState): ViewTemplate => html`
    <span style="color: ${bodyFontColor.createCSS()};">${stateName}</span>
    <nimble-icon-check class="${state}"></nimble-icon-check>
`;

export const iconThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [iconStatusStates])
);

export const hiddenIcon: Story = createStory(
    hiddenWrapper(
        html`<nimble-icon-check class="pass" hidden></nimble-icon-check>`
    )
);
