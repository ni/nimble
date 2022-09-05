import type { Story, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { IconSeverity } from '../types';
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

const severityStates: [string, string | undefined][] = Object.entries(
    IconSeverity
).map(([key, value]) => [pascalCase(key), value]);
type SeverityState = typeof severityStates[number];

const component = ([stateName, state]: SeverityState): ViewTemplate => html`
    <span style="color: var(${() => bodyFontColor.cssCustomProperty});">
        ${() => stateName}
    </span>
    <nimble-icon-check severity="${() => state}"></nimble-icon-check>
`;

export const iconThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [severityStates])
);

export const hiddenIcon: Story = createStory(
    hiddenWrapper(html`<nimble-icon-check hidden></nimble-icon-check>`)
);
