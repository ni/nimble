import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { TextAreaAppearance } from '../types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    ReadOnlyState,
    readOnlyStates
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';

const metadata: Meta = {
    title: 'Tests/Text Area',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/specs/'
        }
    }
};

export default metadata;

const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', 'Hello', null],
    ['Long Value', loremIpsum, null]
] as const;
type ValueState = typeof valueStates[number];

const appearanceStates = Object.entries(TextAreaAppearance).map(
    ([key, value]) => [pascalCase(key), value]
);
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

export const textAreaThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        readOnlyStates,
        disabledStates,
        appearanceStates,
        valueStates
    ])
);

const widthSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [colsLabel, cols]: [string, number | undefined]
): ViewTemplate => html`
    <div style="width: 500px; height: 100px; outline: 1px dotted black">
        <nimble-text-area
            cols="${() => cols}"
            style="${widthStyle}"
            value="${loremIpsum}"
        >
            ${widthLabel} ${colsLabel}
        </nimble-text-area>
    </div>
`;

const heightSizingTestCase = (
    [heightLabel, heightStyle]: [string, string],
    [rowsLabel, rows]: [string, number | undefined]
): ViewTemplate => html`
    <div style="width: 500px; height: 100px; outline: 1px dotted black">
        <nimble-text-area
            rows="${() => rows}"
            style="${heightStyle}"
            value="${loremIpsum}"
        >
            ${heightLabel} ${rowsLabel}
        </nimble-text-area>
    </div>
`;

export const textAreaSizing: Story = createStory(html`
    ${createMatrix(widthSizingTestCase, [
        [
            ['No width', ''],
            ['Width=300px', 'width: 300px'],
            ['Width=100%', 'width: 100%']
        ],
        [
            ['no cols', undefined],
            ['cols=10', 10]
        ]
    ])}
    ${createMatrix(heightSizingTestCase, [
        [
            ['No height', ''],
            ['Height=50px', 'height: 50px'],
            ['Height=100%', 'height: 100%']
        ],
        [
            ['no rows', undefined],
            ['rows=3', 3]
        ]
    ])}
`);

export const hiddenTextArea: Story = createStory(
    hiddenWrapper(
        html`<nimble-text-area hidden>Hidden text area</nimble-text-area>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html` <nimble-text-area value="${loremIpsum}">
            Text area
        </nimble-text-area>`
    )
);
