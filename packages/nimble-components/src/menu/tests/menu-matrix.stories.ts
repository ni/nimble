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
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';

const metadata: Meta = {
    title: 'Tests/Menu',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        }
    }
};

export default metadata;

/* array of showSubMenu, childIcon, advancedSubMenu */
const subMenuStates = [
    [false, false, false],
    [true, false, false],
    [true, false, true],
    [true, true, false],
    [true, true, true]
] as const;
type SubMenuState = typeof subMenuStates[number];

// prettier-ignore
const component = (
    parentIcon: IconVisibleState,
    [showSubMenu, childIcon, advancedSubMenu]: SubMenuState
): ViewTemplate => html`
    <span style="${() => (showSubMenu ? 'padding: 15px; padding-right: 200px; display:inline-flex;' : 'padding: 15px; display:inline-flex;')}">
        <nimble-menu>
            <header>Header</header>
            <nimble-menu-item ?expanded=${() => showSubMenu}>
                Item 1
                ${when(() => showSubMenu, html`
                    <nimble-menu>
                        ${when(() => advancedSubMenu, html`<header>Child header</header>`)}
                        <nimble-menu-item>Item 1.1</nimble-menu-item>
                        <nimble-menu-item>Item 1.2</nimble-menu-item>
                        ${when(() => advancedSubMenu, html`<hr>`)}
                        <nimble-menu-item>${when(() => childIcon, html`<nimble-icon-xmark slot="start"></nimble-icon-xmark>`)}Item 1.3</nimble-menu-item>
                    </nimble-menu>
                `)}
            </nimble-menu-item>
            <hr>
            <nimble-menu-item disabled>Item 2</nimble-menu-item>
            <nimble-menu-item>${when(() => parentIcon, html`<nimble-icon-user slot="start"></nimble-icon-user>`)}Item 3</nimble-menu-item>
            <nimble-menu-item hidden>Item 4</nimble-menu-item>
        </nimble-menu>
    </span>
`;

export const menuThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [iconVisibleStates, subMenuStates])
);

export const hiddenMenu: Story = createStory(
    hiddenWrapper(
        html`<nimble-menu hidden>
            <nimble-menu-item>Item 1</nimble-menu-item>
        </nimble-menu>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html` <nimble-menu>
            Inner text
            <nimble-menu-item>Menu item</nimble-menu-item>
        </nimble-menu>`
    )
);
