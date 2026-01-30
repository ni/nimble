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

const characterLimitStates = [
    ['empty', ''],
    ['one line', '100']
] as const;
type CharacterLimitState = (typeof characterLimitStates)[number];

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
    [characterLimitLabel, characterLimit]: CharacterLimitState
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >    
        ${valueLabel} value, ${placeholderLabel} placeholder, ${characterLimitLabel} character limit
    </p>
    <${chatInputTag}
        placeholder="${placeholder}"
        value="${value}"
        character-limit="${characterLimit}"
    >
    </${chatInputTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [valueStates, placeholderStates, characterLimitStates])
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
