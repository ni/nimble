import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperclipTag } from '@ni/nimble-components/dist/esm/icons/paperclip';
import {
    sharedMatrixParameters,
    createMatrixThemeStory,
    createMatrix
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

const attachmentStates = [
    ['none', false],
    ['attachment', true]
] as const;
type AttachmentState = (typeof attachmentStates)[number];

const metadata: Meta = {
    title: 'Tests Spright/Chat Input',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [valueLabel, value]: ValueState,
    [placeholderLabel, placeholder]: PlaceholderState,
    [attachmentLabel, attachment]: AttachmentState
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >    
        ${valueLabel} value, ${placeholderLabel} placeholder, ${attachmentLabel} attachment
    </p>
    <${chatInputTag}
        placeholder="${placeholder}"
        value="${value}"
    >
        ${attachment
        ? html`<${chipTag} removable slot="attachments">
                Attachment
            </${chipTag}>
            <${buttonTag} content-hidden appearance="ghost" slot="start">
                <${iconPaperclipTag} slot="start"></${iconPaperclipTag}>
            </${buttonTag}>
        `
        : ''}
    </${chatInputTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [valueStates, placeholderStates, attachmentStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatInputTag} hidden>Hidden Chat Input</${chatInputTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(html`<${chatInputTag}></${chatInputTag}>`)
);
