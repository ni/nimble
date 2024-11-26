import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { chatMessageTag } from '../../../../spright-components/src/chat-message';
import {
    apiCategory,
    createUserSelectedThemeStory,
} from '../../utilities/storybook';

interface ChatMessageArgs {
    text: string;
}

const metadata: Meta<ChatMessageArgs> = {
    title: 'Spright/Chat',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag}
            text="${x => x.text}"
        ></${chatMessageTag}>
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

export const chatMessage: StoryObj<ChatMessageArgs> = {};
