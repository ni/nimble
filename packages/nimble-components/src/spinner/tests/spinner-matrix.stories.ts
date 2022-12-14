import type { Story, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { withXD } from 'storybook-addon-xd-designs';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { SpinnerSize } from '../types';
import { bodyFontColor } from '../../theme-provider/design-tokens';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Spinner',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/dece308f-79e7-48ec-ab41-011f3376b49b/specs/'
        }
    }
};

export default metadata;

const sizeStates: [string, string | undefined][] = Object.entries(
    SpinnerSize
).map(([key, value]) => [pascalCase(key), value]);
type SizeState = typeof sizeStates[number];

const component = ([stateName, state]: SizeState): ViewTemplate => html`
    <span style="color: var(${() => bodyFontColor.cssCustomProperty});">
        ${() => stateName}
    </span>
    <nimble-spinner size="${() => state}"></nimble-spinner>
`;

export const spinnerThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [sizeStates])
);

export const hiddenSpinner: Story = createStory(
    hiddenWrapper(html`<nimble-spinner hidden></nimble-spinner>`)
);
