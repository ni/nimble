import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import {
    sharedMatrixParameters,
    createMatrixThemeStory,
    createMatrix,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';
import { textCustomizationWrapper } from '../../../utilities/text-customization';
import { loremIpsum } from '../../../utilities/lorem-ipsum';

const valueStates = [
    ['empty', ''],
    ['one line', "My cat's breath smells like cat food."],
    ['multi line', `${loremIpsum} ${loremIpsum} ${loremIpsum}`]
] as const;
type ValueState = (typeof valueStates)[number];

const placeholderStates = [
    ['empty', ''],
    ['one line', 'This is the placeholder']
] as const;
type PlaceholderState = (typeof placeholderStates)[number];

const processingStates = [
    ['', false],
    ['processing', true]
] as const;
type ProcessingState = (typeof processingStates)[number];

const errorStates = [
    ['empty', ''],
    ['one line', 'Error description'],
    ['multi line', `${loremIpsum} ${loremIpsum} ${loremIpsum}`]
] as const;
type ErrorState = (typeof errorStates)[number];

const showCounterStates = [
    ['', false],
    ['counter', true]
] as const;
type ShowCounterState = (typeof showCounterStates)[number];

const showCounterMaxLengthStates = [
    ['no counter', false, 'no limit', -1],
    ['counter', true, 'no limit', -1],
    ['counter', true, 'limit 100', 100]
] as const;
type ShowCounterMaxLengthState = (typeof showCounterMaxLengthStates)[number];

const metadata: Meta = {
    title: 'Tests Spright/Chat Input',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [valueLabel, value]: ValueState,
    [placeholderLabel, placeholder]: PlaceholderState,
    [processingLabel, processing]: ProcessingState,
    [errorLabel, error]: ErrorState,
    [showCounterLabel, showCounter, maxLengthLabel, maxLength]: ShowCounterMaxLengthState
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >    
        ${valueLabel} value, ${placeholderLabel} placeholder, ${processingLabel}, ${errorLabel} error, ${showCounterLabel}, ${maxLengthLabel}
    </p>
    ${showCounter
        ? html`
            <${chatInputTag}
                placeholder="${placeholder}"
                value="${value}"
                processing="${processing}"
                error-visible="${error !== ''}"
                error-text="${error}"
                show-counter
                maxlength="${maxLength}"
            >
            </${chatInputTag}>
        `
        : html`
            <${chatInputTag}
                placeholder="${placeholder}"
                value="${value}"
                processing="${processing}"
                error-visible="${error !== ''}"
                error-text="${error}"
                maxlength="${maxLength}"
            >
            </${chatInputTag}>
        `}
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [valueStates, placeholderStates, processingStates, errorStates, showCounterMaxLengthStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatInputTag} hidden>Hidden Chat Input</${chatInputTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${chatInputTag}></${chatInputTag}>`)
);

const componentWithPlaceholder = (
    [_, placeholder]: PlaceholderState,
    [__, showCounter]: ShowCounterState
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >    
    </p>
    ${showCounter
        ? html`
            <${chatInputTag}
                placeholder="${placeholder}"
                show-counter
            >
            </${chatInputTag}>
        `
        : html`
            <${chatInputTag}
                placeholder="${placeholder}"
            >
            </${chatInputTag}>
        `}
`;

const interactionStates = cartesianProduct([placeholderStates, showCounterStates] as const);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(componentWithPlaceholder, {
        hover: interactionStates,
        hoverActive: interactionStates,
        active: [],
        focus: interactionStates
    })
);
