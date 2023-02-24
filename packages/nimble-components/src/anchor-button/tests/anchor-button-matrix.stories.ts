import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '../../patterns/button/types';
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
import { AnchorButton } from '..';
import { IconLink } from '../../icons/link';
import { IconArrowExpanderRight } from '../../icons/arrow-expander-right';

const nimbleAnchorButton = DesignSystem.tagFor(AnchorButton);
const nimbleIconLink = DesignSystem.tagFor(IconLink);
const nimbleIconArrowExpanderRight = DesignSystem.tagFor(
    IconArrowExpanderRight
);

const metadata: Meta = {
    title: 'Tests/Anchor Button',
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
type PartVisibilityState = (typeof partVisibilityStates)[number];

const appearanceStates: [string, string | undefined][] = Object.entries(
    ButtonAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

const appearanceVariantStates: [string, string | undefined][] = Object.entries(
    ButtonAppearanceVariant
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceVariantState = (typeof appearanceVariantStates)[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [appearanceVariantName, appearanceVariant]: AppearanceVariantState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <${nimbleAnchorButton}
        href="https://nimble.ni.dev"
        appearance="${() => appearance}"
        appearance-variant="${() => appearanceVariant}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<${nimbleIconLink} slot="start"></${nimbleIconLink}>`)}
            ${() => `${appearanceVariantName} ${appearanceName} Link ${disabledName}`}
            ${when(() => endIconVisible, html`<${nimbleIconArrowExpanderRight} slot="end"></${nimbleIconArrowExpanderRight}>`)}
    </${nimbleAnchorButton}>
`;

export const anchorButtonThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        appearanceVariantStates,
        partVisibilityStates
    ])
);

export const hiddenAnchorButton: Story = createStory(
    hiddenWrapper(
        html`<${nimbleAnchorButton} hidden
            >Hidden Anchor Button</${nimbleAnchorButton}
        >`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${nimbleAnchorButton}>Anchor Button</${nimbleAnchorButton}>`
    )
);
