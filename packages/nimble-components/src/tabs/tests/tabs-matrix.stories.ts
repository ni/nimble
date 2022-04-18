import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import {
    DisabledState,
    disabledStates,
    createMatrix,
    themeWrapper,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import '..';
import '../../tab';
import '../../tab-panel';
import '../../tabs-toolbar';
import '../../button';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Tabs',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        },
        ...sharedMatrixParameters()
    }
};

export default metadata;

type TabsToolbarState = boolean;
const tabsToolbarState: TabsToolbarState[] = [false, true];

// prettier-ignore
const component = (
    toolbar: TabsToolbarState,
    [disabledName, disabled]: DisabledState
): ViewTemplate => html`
    <nimble-tabs style="padding: 15px;">
        ${when(() => toolbar, html`
            <nimble-tabs-toolbar>
                <nimble-button appearance="ghost">Toolbar Button</nimble-button>
            </nimble-tabs-toolbar>
        `)}
        <nimble-tab>Tab One</nimble-tab>
        <nimble-tab ?disabled="${() => disabled}">
            Tab Two ${() => disabledName}
        </nimble-tab>
        <nimble-tab hidden>Tab Three</nimble-tab>
        <nimble-tab-panel>Tab content one</nimble-tab-panel>
        <nimble-tab-panel>Tab content two</nimble-tab-panel>
        <nimble-tab-panel>Tab content three</nimble-tab-panel>
    </nimble-tabs>
`;

export const tabsThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [tabsToolbarState, disabledStates]))
);

export const hiddenTabs: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-tabs hidden>
            <nimble-tab>Tab One</nimble-tab>
            <nimble-tab-panel>Tab content one</nimble-tab-panel>
        </nimble-tabs>`
    )
);
