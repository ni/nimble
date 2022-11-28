import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Anchor',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46'
        }
    }
};

export default metadata;

const inlineStates = [
    ['', false],
    ['Inline', true]
] as const;
type InlineState = typeof inlineStates[number];

const prominentStates = [
    ['', false],
    ['Prominent', true]
] as const;
type ProminentState = typeof prominentStates[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [inlineName, inline]: InlineState,
    [prominentName, prominent]: ProminentState
): ViewTemplate => html`
    <nimble-anchor
        href="http://nimble.ni.dev"
        ?inline="${() => inline}"
        ?prominent="${() => prominent}"
        ?disabled=${() => disabled}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${() => `${inlineName} ${prominentName} Link ${disabledName}`}
    </nimble-anchor>
`;

export const anchorThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        inlineStates,
        prominentStates
    ])
);

export const hiddenAnchor: Story = createStory(
    hiddenWrapper(html`<nimble-anchor hidden>Hidden Anchor</nimble-anchor>`)
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(html`<nimble-anchor>Link</nimble-anchor>`)
);
