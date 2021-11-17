import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrix, themeWrapper } from '../../utilities/tests/matrix';

import '../../icons/check';
import { createRenderer } from '../../utilities/tests/storybook';
import { IconStatus } from './types';
import { contentFontColor } from '../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Icon',
    decorators: [withXD],
    parameters: {
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

const iconStatusStates = [
    ['Pass', IconStatus.Pass],
    ['Fail', IconStatus.Fail],
    ['Warning', IconStatus.Warning],
    ['Regular', IconStatus.Regular]
];
type IconStatusState = typeof iconStatusStates[number];

const component = ([stateName, state]: IconStatusState): ViewTemplate => html`
    <span style="color: ${contentFontColor.createCSS()};">${stateName}</span>
    <nimble-check-icon class="${state}"></nimble-check-icon>
`;

export const iconThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [iconStatusStates]))
);

export const hiddenIcon = createRenderer(
    html` <div>
        <nimble-check-icon class="pass" hidden></nimble-check-icon>
    </div>`
);
