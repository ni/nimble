import type { Story, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters,
    themeWrapper
} from '../../utilities/tests/matrix';

import '../../icons/check';
import { createRenderer } from '../../utilities/tests/storybook';
import { IconStatus } from '../types';
import { bodyFontColor } from '../../theme-provider/design-tokens';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Icon',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const iconStatusStates = [
    ['Pass', IconStatus.Pass],
    ['Fail', IconStatus.Fail],
    ['Warning', IconStatus.Warning],
    ['Regular', IconStatus.Regular]
] as const;
type IconStatusState = typeof iconStatusStates[number];

const component = ([stateName, state]: IconStatusState): ViewTemplate => html`
    <span style="color: ${bodyFontColor.createCSS()};">${stateName}</span>
    <nimble-check-icon class="${state}"></nimble-check-icon>
`;

export const iconThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [iconStatusStates]))
);

export const hiddenIcon: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-check-icon class="pass" hidden></nimble-check-icon>`
    )
);
