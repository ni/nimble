import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import { TextAreaAppearance } from '../types';
import {
    createMatrix,
    themeWrapper,
    disabledStates,
    DisabledState,
    ReadOnlyState,
    readOnlyStates
} from '../../utilities/tests/matrix';
import '..';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Text Area',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/specs/'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', 'Hello', null],
    [
        'Long Value',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        null
    ]
];
type ValueState = typeof valueStates[number];

const appearanceStates = Object.entries(TextAreaAppearance);
type AppearanceState = typeof appearanceStates[number];

const component = (
    [readOnlyName, readonly]: ReadOnlyState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [valueName, valueValue, placeholderValue]: ValueState
): ViewTemplate => html`
    <nimble-text-area
        style="width: 250px; padding: 15px;"
        ?disabled="${() => disabled}"
        appearance="${() => appearance}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?readonly="${() => readonly}"
    >
        ${() => disabledName} ${() => appearanceName} ${() => valueName}
        ${() => readOnlyName}
    </nimble-text-area>
`;

export const textAreaThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            readOnlyStates,
            disabledStates,
            appearanceStates,
            valueStates
        ])
    )
);

export const hiddenTextArea: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-text-area hidden>Hidden text area</nimble-text-area>`
    )
);
