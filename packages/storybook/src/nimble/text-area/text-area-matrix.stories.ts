import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { TextAreaAppearance } from '@ni/nimble-components/dist/esm/text-area/types';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    type DisabledReadOnlyState,
    disabledReadOnlyStates,
    type ErrorState,
    errorStates,
    type RequiredVisibleState,
    requiredVisibleStates,
    backgroundStates
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const appearanceStates = [
    ['Outline', TextAreaAppearance.outline],
    ['Block', TextAreaAppearance.block]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', 'Hello', null],
    ['Long Value', loremIpsum, null]
] as const;
type ValueState = (typeof valueStates)[number];

const metadata: Meta = {
    title: 'Tests/Text Area',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [
        disabledReadOnlyName,
        readOnly,
        disabled,
        appearanceReadOnly
    ]: DisabledReadOnlyState,
    [appearanceName, appearance]: AppearanceState,
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [valueName, valueValue, placeholderValue]: ValueState,
    [errorStateName, isError, errorText]: ErrorState
): ViewTemplate => html`
    <style>
        ${textAreaTag} {
            width: 250px;
            margin: 0px 8px 16px 8px;
        }
    </style>
    <${textAreaTag}
        ?disabled="${() => disabled}"
        appearance="${() => appearance}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?readonly="${() => readOnly}"
        ?appearance-readonly="${() => appearanceReadOnly}"
        ?error-visible="${() => isError}"
        error-text="${() => errorText}"
        ?required-visible="${() => requiredVisible}"
    >
        ${() => disabledReadOnlyName} ${() => appearanceName} ${() => valueName}
        ${() => errorStateName} ${() => requiredVisibleName}
    </${textAreaTag}>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

export const lightTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        disabledReadOnlyStates,
        appearanceStates,
        requiredVisibleStates,
        valueStates,
        errorStates
    ]),
    lightThemeWhiteBackground
);

export const colorTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        disabledReadOnlyStates,
        appearanceStates,
        requiredVisibleStates,
        valueStates,
        errorStates
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        disabledReadOnlyStates,
        appearanceStates,
        requiredVisibleStates,
        valueStates,
        errorStates
    ]),
    darkThemeBlackBackground
);

const widthSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [colsLabel, cols]: [string, number | undefined]
): ViewTemplate => html`
    <div style="width: 500px; height: 100px; outline: 1px dotted black">
        <${textAreaTag}
            cols="${() => cols}"
            style="${widthStyle}"
            value="${loremIpsum}"
        >
            ${widthLabel} ${colsLabel}
        </${textAreaTag}>
    </div>
`;

const heightSizingTestCase = (
    [heightLabel, heightStyle]: [string, string],
    [rowsLabel, rows]: [string, number | undefined]
): ViewTemplate => html`
    <div style="width: 500px; height: 100px; outline: 1px dotted black">
        <${textAreaTag}
            rows="${() => rows}"
            style="${heightStyle}"
            value="${loremIpsum}"
        >
            ${heightLabel} ${rowsLabel}
        </${textAreaTag}>
    </div>
`;

export const sizing: StoryFn = createStory(html`
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

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${textAreaTag} hidden>Hidden text area</${textAreaTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html` <${textAreaTag} value="${loremIpsum}">
            Text area
        </${textAreaTag}>`
    )
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${textAreaTag} style="border: 1px dashed; width: 200px">
                With Label
            </${textAreaTag}>
            <${textAreaTag} style="border: 1px dashed; width: 200px">
            </${textAreaTag}>
        </div>
    `
);
