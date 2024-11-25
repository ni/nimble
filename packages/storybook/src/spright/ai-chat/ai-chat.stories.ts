import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { aiChatTextBubbleTag } from '../../../../spright-components/src/ai-chat-text-bubble';
import {
    apiCategory,
    createUserSelectedThemeStory,
} from '../../utilities/storybook';

interface AIChatTextBubbleArgs {
    text: string;
}

const metadata: Meta<AIChatTextBubbleArgs> = {
    title: 'Spright/AI Chat',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${aiChatTextBubbleTag}
            text="${x => x.text}"
        ></${aiChatTextBubbleTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the AI chat text bubble.',
            table: { category: apiCategory.slots }
        },
    },
    args: {
        text: 'Hi, how are you?',
    }
};

export default metadata;

export const aiChatTextBubble: StoryObj<AIChatTextBubbleArgs> = {};
