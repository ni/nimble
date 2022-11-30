import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
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
import { AnchorAppearance } from '../types';

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

const underlineVisibleStates = [
    ['', false],
    ['Underline Visible', true]
] as const;
type UnderlineVisibleState = typeof underlineVisibleStates[number];

const appearanceStates: [string, string | undefined][] = Object.entries(
    AnchorAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = typeof appearanceStates[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [underlineVisibleName, underlineVisible]: UnderlineVisibleState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <nimble-anchor
        href="http://nimble.ni.dev"
        ?underline-visible="${() => underlineVisible}"
        appearance="${() => appearance}"
        ?disabled=${() => disabled}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${() => `${underlineVisibleName} ${appearanceName} Link ${disabledName}`}
    </nimble-anchor>
`;

export const anchorThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        underlineVisibleStates,
        appearanceStates
    ])
);

export const hiddenAnchor: Story = createStory(
    hiddenWrapper(html`<nimble-anchor hidden>Hidden Anchor</nimble-anchor>`)
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(html`<nimble-anchor>Link</nimble-anchor>`)
);
