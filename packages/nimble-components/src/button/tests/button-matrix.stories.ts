import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { ButtonAppearance } from '../types';
import {
    disabledStates,
    DisabledState,
    iconVisibleStates,
    IconVisibleState,
    createMatrix,
    themeWrapper
} from '../../utilities/tests/matrix';
import { createRenderer } from '../../utilities/tests/storybook';
import '../index';
import '../../icons/access-control';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

export const defaultButton = createRenderer(
    html`<nimble-button>Default Button</nimble-button>`
);
const noContent = 'NO_CONTENT';
const appearanceStates = [...Object.entries(ButtonAppearance), [noContent, '']];
type AppearanceState = typeof appearanceStates[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    iconVisible: IconVisibleState
): ViewTemplate => html`
    <nimble-button appearance="${() => appearance}" ?disabled=${() => disabled}>
        ${when(() => iconVisible, html`<nimble-access-control-icon></nimble-access-control-icon>`)}
        ${() => (appearanceName === noContent ? '' : `${appearanceName} Button ${disabledName}`)}
    </nimble-button>
`;

export const buttonThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            disabledStates,
            appearanceStates,
            iconVisibleStates
        ])
    )
);

export const hiddenButton = createRenderer(
    hiddenWrapper(html`<nimble-button hidden>Hidden Button</nimble-button>`)
);
