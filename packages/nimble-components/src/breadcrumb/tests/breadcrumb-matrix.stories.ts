import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import { BreadcrumbAppearance } from '../types';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';

const metadata: Meta = {
    title: 'Tests/Breadcrumb',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e/specs/'
        }
    }
};

export default metadata;

const appearanceStates: [string, string | undefined][] = Object.entries(
    BreadcrumbAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = typeof appearanceStates[number];

const component = ([
    appearanceName,
    appearance
]: AppearanceState): ViewTemplate => html`
    <nimble-breadcrumb
        appearance="${() => appearance}"
        style="margin-right: 24px"
    >
        <nimble-breadcrumb-item href="${parent.location.href}">
            ${() => `Breadcrumb (${appearanceName}) - Link`}
        </nimble-breadcrumb-item>
        <nimble-breadcrumb-item>Current (No Link)</nimble-breadcrumb-item>
    </nimble-breadcrumb>
`;
export const breadcrumbThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [appearanceStates])
);

export const hiddenBreadcrumb: Story = createStory(
    hiddenWrapper(
        html`<nimble-breadcrumb hidden>
            <nimble-breadcrumb-item href="#">Item 1</nimble-breadcrumb-item>
            <nimble-breadcrumb-item>Current (No Link)</nimble-breadcrumb-item>
        </nimble-breadcrumb>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<nimble-breadcrumb-item>Breadcrumb item</nimble-breadcrumb-item>`
    )
);
