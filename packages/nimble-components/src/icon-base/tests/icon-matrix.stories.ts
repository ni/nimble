import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import { createStory } from '../../utilities/tests/storybook';
import { IconSeverity } from '../types';
import { bodyFontColor } from '../../theme-provider/design-tokens';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { iconCheckTag } from '../../icons/check';

const severityStates = [
    ['Default', IconSeverity.default],
    ['Error', IconSeverity.error],
    ['Warning', IconSeverity.warning],
    ['Success', IconSeverity.success],
    ['Information', IconSeverity.information],
] as const;
type SeverityState = (typeof severityStates)[number];

const metadata: Meta = {
    title: 'Tests/Icon',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([stateName, state]: SeverityState): ViewTemplate => html`
    <span style="color: var(${() => bodyFontColor.cssCustomProperty});">
        ${() => stateName}
    </span>
    <${iconCheckTag} severity="${() => state}"></${iconCheckTag}>
`;

export const iconThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [severityStates])
);

export const hiddenIcon: StoryFn = createStory(
    hiddenWrapper(html`<${iconCheckTag} hidden></${iconCheckTag}>`)
);
