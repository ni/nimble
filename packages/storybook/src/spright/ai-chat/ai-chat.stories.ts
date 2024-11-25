import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { aiChatTextBubbleTag } from '../../../../spright-components/src/ai-chat-text-bubble';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';

interface AIChatTextBubbleArgs {
    text: string;
    disabled: boolean;
}

const metadata: Meta<AIChatTextBubbleArgs> = {
    title: 'Spright/AI Chat',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${aiChatTextBubbleTag}
            ?disabled="${x => x.disabled}"
        >${x => x.text}</${aiChatTextBubbleTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the AI chat text bubble.',
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({ componentName: 'AI chat text bubble' }),
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Spright',
        disabled: false
    }
};

export default metadata;

export const aiChatTextBubble: StoryObj<AIChatTextBubbleArgs> = {};
