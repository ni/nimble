import { html, ViewTemplate, when } from '@microsoft/fast-element';
import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import {
    createMatrix,
    IconVisibleState,
    iconVisibleStates,
    themeWrapper
} from '../../utilities/tests/matrix';
import '../index';
import '../../icons/admin';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

// prettier-ignore
const component = (
    icon: IconVisibleState
): ViewTemplate => html`
    <span style="display:inline-flex;">
        <nimble-menu style="padding: 15px;">
            <header>Header</header>
            <nimble-menu-item>Item 1</nimble-menu-item>
            <hr>
            <nimble-menu-item disabled>Item 2</nimble-menu-item>
            <nimble-menu-item>${when(() => icon, html`<nimble-admin-icon></nimble-admin-icon>`)}Item 3</nimble-menu-item>
            <nimble-menu-item hidden>Item 3</nimble-menu-item>
        </nimble-menu>
    </span>
`;

export const menuThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [iconVisibleStates]))
);

export const hiddenMenu = createRenderer(
    hiddenWrapper(
        html`<nimble-menu hidden>
            <nimble-menu-item>Item 1</nimble-menu-item>
        </nimble-menu>`
    )
);
