import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { chatToolCallTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary/tool-call';
import { chatToolCallInputTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary/tool-call-input';
import {
    ChatToolCallStatus,
    type ChatToolCallStatus as ChatToolCallStatusType
} from '@ni/spright-components/dist/esm/chat/message/tool-summary/types';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

interface ChatToolCallArgs {
    name: string;
    status: ChatToolCallStatusType;
    content: undefined;
}

interface ChatToolCallInputArgs {
    name: string;
    value: string;
    valueType: 'string' | 'number' | 'boolean' | 'json';
}

const metadata: Meta<ChatToolCallArgs> = {
    title: 'Internal/Chat Tool Call'
};

export default metadata;

export const toolCall: StoryObj<ChatToolCallArgs> = {
    render: createUserSelectedThemeStory(html<ChatToolCallArgs>`
        <div style="width: min(560px, 100%);">
            <${chatToolCallTag} name="${x => x.name}" status="${x => x.status}">
                <${chatToolCallInputTag} name="paths" value='["Line1.*","Line2.*"]' value-type="json"></${chatToolCallInputTag}>
                <${chatToolCallInputTag} name="keywords" value='["production"]' value-type="json"></${chatToolCallInputTag}>
            </${chatToolCallTag}>
        </div>
    `),
    argTypes: {
        name: {
            description: 'The tool identity displayed to the user.',
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        status: {
            description: 'The runtime status of the tool call.',
            options: Object.values(ChatToolCallStatus),
            control: { type: 'select' },
            table: { category: apiCategory.attributes }
        },
        content: {
            name: 'default',
            description: `Place ordered \`${chatToolCallInputTag}\` elements in the default slot.`,
            table: { category: apiCategory.slots }
        }
    },
    args: {
        name: 'systemlink.tags.search_tags',
        status: ChatToolCallStatus.warning
    }
};

export const toolCallInput: StoryObj<ChatToolCallInputArgs> = {
    render: createUserSelectedThemeStory(html<ChatToolCallInputArgs>`
        <div style="width: min(560px, 100%);">
            <${chatToolCallInputTag}
                name="${x => x.name}"
                value="${x => x.value}"
                value-type="${x => x.valueType}"
            ></${chatToolCallInputTag}>
        </div>
    `),
    argTypes: {
        name: {
            description: 'The input name.',
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'The serialized input value.',
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        valueType: {
            name: 'value-type',
            description: 'How to interpret and display the serialized value.',
            options: ['string', 'number', 'boolean', 'json'],
            control: { type: 'select' },
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        name: 'paths',
        value: '["Line1.*","Line2.*"]',
        valueType: 'json'
    }
};