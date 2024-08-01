import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { bodyFontColor } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { iconCheckTag } from '../../../../nimble-components/src/icons/check';
import { IconSeverity } from '../../../../nimble-components/src/icon-base/types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const severityStates = [
    ['Default', IconSeverity.default],
    ['Error', IconSeverity.error],
    ['Warning', IconSeverity.warning],
    ['Success', IconSeverity.success],
    ['Information', IconSeverity.information]
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
