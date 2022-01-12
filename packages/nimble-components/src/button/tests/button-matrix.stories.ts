import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { ButtonAppearance } from '../types';
import {
    disabledStates,
    DisabledState,
    createMatrix,
    themeWrapper
} from '../../utilities/tests/matrix';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
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

export const defaultButton: Story = createRenderer(
    html`<nimble-button>Default Button</nimble-button>`
);

type PartVisibilityState = [boolean, boolean];
const partVisibilityStates: PartVisibilityState[] = [[true, true], [true, false], [false, true]];

const appearanceStates = Object.entries(ButtonAppearance);
type AppearanceState = typeof appearanceStates[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [labelVisible, iconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <nimble-button appearance="${() => appearance}" ?disabled=${() => disabled}>
        ${when(() => iconVisible, html`<nimble-access-control-icon></nimble-access-control-icon>`)}
        ${() => (labelVisible ? `${appearanceName} Button ${disabledName}` : '')}
    </nimble-button>
`;

export const buttonThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            disabledStates,
            appearanceStates,
            partVisibilityStates
        ])
    )
);

export const hiddenButton: Story = createRenderer(
    hiddenWrapper(html`<nimble-button hidden>Hidden Button</nimble-button>`)
);
