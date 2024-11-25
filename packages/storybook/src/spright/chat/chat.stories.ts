import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { chatTextBubbleTag } from '../../../../spright-components/src/chat-text-bubble';
import {
    apiCategory,
    createUserSelectedThemeStory,
} from '../../utilities/storybook';

interface ChatTextBubbleArgs {
    text: string;
}

const metadata: Meta<ChatTextBubbleArgs> = {
    title: 'Spright/Chat',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatTextBubbleTag}
            text="${x => x.text}"
        ></${chatTextBubbleTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the chat text bubble.',
            table: { category: apiCategory.slots }
        },
    },
    args: {
        text: 'Hi, how are you?',
    }
};

export default metadata;

export const chatTextBubble: StoryObj<ChatTextBubbleArgs> = {};
