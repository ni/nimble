import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { TextAreaAppearance } from '@ni/nimble-components/dist/esm/text-area/types';
import { bodyFontColor, bodyPlus1EmphasizedFont } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    type ManipulationState,
    manipulationStates,
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
        manipulationName,
        readOnly,
        disabled,
        appearanceReadOnly
    ]: ManipulationState,
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
        ${() => manipulationName} ${() => appearanceName} ${() => valueName}
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
        manipulationStates,
        appearanceStates,
        requiredVisibleStates,
        valueStates,
        errorStates
    ]),
    lightThemeWhiteBackground
);

export const colorTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
        appearanceStates,
        requiredVisibleStates,
        valueStates,
        errorStates
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
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

const fieldSizingTestCase = (
    fieldSizingStyle: string,
    [widthStyleLabel, widthStyles]: [string, string],
    value: string,
    errorString: string | undefined
): ViewTemplate => html`
    <${textAreaTag}
        style="${fieldSizingStyle} ${widthStyles} ${errorString ? 'margin-bottom: 24px' : 'margin-bottom: 4px'}"
        value="${value}"
        ?error-visible="${() => errorString !== undefined}"
        error-text="${() => errorString}"
    >
        ${widthStyleLabel}
    </${textAreaTag}>
`;

export const fieldSizing: StoryFn = createStory(html`
    <style>
        div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        label {
            font: var(${bodyPlus1EmphasizedFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            margin-bottom: 6px;
        }
    </style>
    <label>field-sizing=content (no min-width unless specified)</label>
    ${createMatrix(fieldSizingTestCase, [
        ['field-sizing: content;'],
        [
            ['', 'min-width: 0;'],
            ['min-width=100px', ''],
            ['width=200px', 'width: 200px;'],
        ],
        ['tiny', 'Text longer than the default width.', 'line 1\nline 2\nline 3'],
        [undefined, 'Error text is helpful']
    ])}
    <label>Default styling (size=20, and rows=2)</label>
    ${createMatrix(fieldSizingTestCase, [
        [''],
        [['', '']],
        ['tiny', 'Text longer than the default width.', 'line 1\nline 2\nline 3'],
        [undefined, 'Error text is helpful']
    ])}
`);

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
