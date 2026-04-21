import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { iconAddTag } from '@ni/nimble-components/dist/esm/icons/add';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
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
    [errorLabel, error]: ErrorState
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >    
        ${valueLabel} value, ${placeholderLabel} placeholder, ${processingLabel}, ${errorLabel} error
    </p>
    <${chatInputTag}
        placeholder="${placeholder}"
        value="${value}"
        processing="${processing}"
        error-visible="${error !== ''}"
        error-text="${error}"
    >
    </${chatInputTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [valueStates, placeholderStates, processingStates, errorStates])
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
    [_, placeholder]: PlaceholderState
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >    
    </p>
    <${chatInputTag}
        placeholder="${placeholder}"
    >
    </${chatInputTag}>
`;

const interactionStates = cartesianProduct([placeholderStates] as const);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(componentWithPlaceholder, {
        hover: interactionStates,
        hoverActive: interactionStates,
        active: [],
        focus: interactionStates
    })
);

export const slottedContent: StoryFn = createMatrixThemeStory(
    html`
        <p
            style="
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            margin-bottom: 0px;
            "
        >
            With attachments and footer-actions
        </p>
        <${chatInputTag} placeholder="Type a message">
            <${chipTag} slot="attachments" removable>Placeholder.txt</${chipTag}>
            <${buttonTag} slot="footer-actions" appearance="ghost" title="Attach" content-hidden>
                <${iconAddTag} slot="start"></${iconAddTag}>
                Attach
            </${buttonTag}>
            <${selectTag} appearance="underline" slot="footer-actions" title="Worker of the Week">
                <${listOptionTag} value="option1">Inanimate Carbon Rod</${listOptionTag}>
                <${listOptionTag} value="option2">Homer Simpson</${listOptionTag}>
            </${selectTag}>
        </${chatInputTag}>
    `
);
