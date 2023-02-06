import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { ButtonAppearance, ButtonAppearanceVariant } from '../types';
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
import '../../all-components';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';

const metadata: Meta = {
    title: 'Tests/Button',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        }
    }
};

export default metadata;

/* array of iconVisible, labelVisible, endIconVisible */
const partVisibilityStates = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
] as const;
type PartVisibilityState = typeof partVisibilityStates[number];

const appearanceStates: [string, string | undefined][] = Object.entries(
    ButtonAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = typeof appearanceStates[number];

const appearanceVariantStates: [string, string | undefined][] = Object.entries(
    ButtonAppearanceVariant
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceVariantState = typeof appearanceVariantStates[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <nimble-button
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<nimble-icon-key slot="start"></nimble-icon-key>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Button ${disabledName}`}
            ${when(() => endIconVisible, html`<nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>`)}
    </nimble-button>
`;

export const buttonThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        appearanceVariantStates,
        partVisibilityStates
    ])
);

export const hiddenButton: Story = createStory(
    hiddenWrapper(html`<nimble-button hidden>Hidden Button</nimble-button>`)
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(html`<nimble-button>Button</nimble-button>`)
);
