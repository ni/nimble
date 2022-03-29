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
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/specs/'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
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

const sizingTestCase = (
    label: string,
    attrString: string
): ViewTemplate => html`
    <div style="width: 500px; height: 100px; outline: 1px dotted black">
        <nimble-text-area
            ${attrString}
            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            >${label}</nimble-text-area
        >
    </div>
`;
export const textAreaSizing: Story = createRenderer(
    html`
        ${sizingTestCase('No width, no cols (default 20)', '')}
        ${sizingTestCase('No width, cols=10', 'cols="10"')}
        ${sizingTestCase('Width=300px, no cols', 'style="width: 300px"')}
        ${sizingTestCase('Width=100%, no cols', 'style="width: 100%"')}
        ${sizingTestCase(
        'Width=300px, cols=10',
        'style="width: 300px" cols="10"'
    )}
        ${sizingTestCase('No height, no rows', '')}
        ${sizingTestCase('No height, rows=3', 'rows="3"')}
        ${sizingTestCase('Height=50px, no rows', 'style="height: 50px"')}
        ${sizingTestCase('Height=100%, no rows', 'style="height: 100%"')}
        ${sizingTestCase(
        'Height=50px, rows=3',
        'style="height: 50px" rows="3"'
    )}
    `
);

export const hiddenTextArea: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-text-area hidden>Hidden text area</nimble-text-area>`
    )
);
