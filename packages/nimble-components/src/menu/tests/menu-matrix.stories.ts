import { html, ViewTemplate, when } from '@microsoft/fast-element';
import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    IconVisibleState,
    iconVisibleStates
} from '../../utilities/tests/states';
import '..';
import '../../icons/user';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        },
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    icon: IconVisibleState
): ViewTemplate => html`
    <span style="padding: 15px; display:inline-flex;">
        <nimble-menu>
            <header>Header</header>
            <nimble-menu-item>Item 1</nimble-menu-item>
            <hr>
            <nimble-menu-item disabled>Item 2</nimble-menu-item>
            <nimble-menu-item>${when(() => icon, html`<nimble-user-icon slot="start"></nimble-user-icon>`)}Item 3</nimble-menu-item>
            <nimble-menu-item hidden>Item 4</nimble-menu-item>
        </nimble-menu>
    </span>
`;

export const menuThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [iconVisibleStates])
);

export const hiddenMenu: Story = createStory(
    hiddenWrapper(
        html`<nimble-menu hidden>
            <nimble-menu-item>Item 1</nimble-menu-item>
        </nimble-menu>`
    )
);
