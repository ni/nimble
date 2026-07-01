import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { TextAreaAppearance } from '@ni/nimble-components/dist/esm/text-area/types';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
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
import {
    fieldSizingStates,
    type FieldSizingState,
    fieldSizingErrorStates,
    type FieldSizingErrorState,
    fieldSizingLabelStates,
    type FieldSizingLabelState
} from '../patterns/field-sizing/states';

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

const fieldSizingWidthStates = [
    ['Default', ''],
    ['min-width=0', 'min-width: 0;'],
    ['width=200px', 'width: 200px;']
] as const;
type FieldSizingWidthState = (typeof fieldSizingWidthStates)[number];

const fieldSizingValueStates = [
    ['Short', 'tiny'],
    ['Long', 'Text longer than the default width'],
    ['Multiline', 'line 1\nline 2\nline 3']
] as const;
type FieldSizingValueState = (typeof fieldSizingValueStates)[number];

const fieldSizingComponent = (
    [widthName, widthStyles]: FieldSizingWidthState,
    [errorName, errorString]: FieldSizingErrorState,
    [labelName, label]: FieldSizingLabelState,
    [fieldSizingName, fieldSizingStyle]: FieldSizingState,
    [valueName, value]: FieldSizingValueState
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; align-items: flex-start; width: min-content;">
        <div style="width: 480px; box-sizing: border-box;">Width(${widthName}) Error(${errorName}) Label(${labelName}) FieldSizing(${fieldSizingName}) Value(${valueName})</div>
        <${textAreaTag}
            style="${fieldSizingStyle} ${widthStyles} ${errorString ? 'margin-bottom: 24px' : 'margin-bottom: 4px'}"
            value="${() => value}"
            ?error-visible="${() => errorString !== undefined}"
            error-text="${() => errorString}"
        >
            ${() => label}
        </${textAreaTag}>
    </div>
`;

const fieldSizingMatrixTemplate = (template: ViewTemplate): ViewTemplate => html`
    <div style="
        display: grid;
        grid-template-columns: ${'1fr '.repeat(fieldSizingValueStates.length)};
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        width: 1500px;
    ">
    ${template}
    </div>
`;

export const fieldSizing: StoryFn = createFixedThemeStory(
    fieldSizingMatrixTemplate(createMatrix(fieldSizingComponent, [
        fieldSizingWidthStates,
        fieldSizingErrorStates,
        fieldSizingLabelStates,
        fieldSizingStates,
        fieldSizingValueStates
    ])),
    lightThemeWhiteBackground
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
