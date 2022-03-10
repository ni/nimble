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
import '../../icons/key';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

export const defaultButton: Story = createRenderer(
    html`<nimble-button>Default Button</nimble-button>`
);

type PartVisibilityState = [boolean, boolean];
const partVisibilityStates: PartVisibilityState[] = [
    [true, true],
    [true, false],
    [false, true]
];

const appearanceStates = Object.entries(ButtonAppearance);
type AppearanceState = typeof appearanceStates[number];

type PrimaryState = [string, string];
const primaryStates: PrimaryState[] = [
    ['Primary', 'primary'],
    ['', '']
];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [primaryName, primaryClass]: PrimaryState,
    [labelVisible, iconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <nimble-button
        appearance="${() => appearance}"
        class="${() => primaryClass}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<nimble-key-icon slot="start"></nimble-key-icon>`)}
            ${() => `${primaryName} ${appearanceName} Button ${disabledName}`}
    </nimble-button>
`;

export const buttonThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            disabledStates,
            appearanceStates,
            primaryStates,
            partVisibilityStates
        ])
    )
);

export const hiddenButton: Story = createRenderer(
    hiddenWrapper(html`<nimble-button hidden>Hidden Button</nimble-button>`)
);
