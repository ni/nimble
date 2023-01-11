import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { DisabledState, disabledStates } from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';

const metadata: Meta = {
    title: 'Tests/Anchor Tabs',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        }
    }
};

export default metadata;

const tabsToolbarState = [false, true] as const;
type TabsToolbarState = typeof tabsToolbarState[number];

// prettier-ignore
const component = (
    toolbar: TabsToolbarState,
    [disabledName, disabled]: DisabledState
): ViewTemplate => html`
    <nimble-anchor-tabs style="padding: 15px;">
        ${when(() => toolbar, html`
            <nimble-tabs-toolbar>
                <nimble-button appearance="ghost">Toolbar Button</nimble-button>
            </nimble-tabs-toolbar>
        `)}
        <nimble-anchor-tab>Tab One</nimble-anchor-tab>
        <nimble-anchor-tab ?disabled="${() => disabled}">
            Tab Two ${() => disabledName}
        </nimble-anchor-tab>
        <nimble-anchor-tab hidden>Tab Three</nimble-anchor-tab>
    </nimble-anchor-tabs>
`;

export const anchorTabsThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarState, disabledStates])
);

export const hiddenTabs: Story = createStory(
    hiddenWrapper(
        html`<nimble-anchor-tabs hidden>
            <nimble-anchor-tab>Tab One</nimble-anchor-tab>
        </nimble-anchor-tabs>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <nimble-anchor-tabs>
                Inner text
                <nimble-tabs-toolbar>Tabs toolbar</nimble-tabs-toolbar>
                <nimble-anchor-tab>Tab</nimble-anchor-tab>
            </nimble-anchor-tabs>
        `
    )
);
