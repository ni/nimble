import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import {
    sharedMatrixParameters,
    createMatrixThemeStory,
    createMatrix
} from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';
import { textCustomizationWrapper } from '../../../utilities/text-customization';
import { loremIpsum } from '../../../utilities/lorem-ipsum';

const textStates = [
    ['empty', ''],
    ['one line', "My cat's breath smells like cat food."],
    ['multi line', `${loremIpsum} ${loremIpsum} ${loremIpsum}`]
] as const;
type LongTextState = (typeof textStates)[number];

const metadata: Meta = {
    title: 'Tests Spright/Chat Input',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [_textLabel, text]: LongTextState
): ViewTemplate => html`
    <${chatInputTag}
        placeholder="This is the placeholder"
        value="${text}"
    >
    </${chatInputTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [textStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatInputTag} hidden>Hidden Chat Input</${chatInputTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${chatInputTag}></${chatInputTag}>`)
);
