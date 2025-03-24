import { html, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

import { buttonTag } from '../../../../../nimble-components/src/button';
import { chatMessageTag } from '../../../../../spright-components/src/chat/message';
import { ChatMessageType } from '../../../../../spright-components/src/chat/message/types';
import { richTextViewerTag } from '../../../../../nimble-components/src/rich-text/viewer';
import { spinnerTag } from '../../../../../nimble-components/src/spinner';
import { imgBlobUrl, markdownExample } from '../conversation/story-helpers';
import { SpinnerAppearance } from '../../../../../nimble-components/src/spinner/types';
import { ButtonAppearance } from '../../../../../nimble-components/src/menu-button/types';
import { isChromatic } from '../../../utilities/isChromatic';
import { iconPencilTag } from '../../../../../nimble-components/src/icons/pencil';
import { iconThumbUpTag } from '../../../../../nimble-components/src/icons/thumb-up';
import { iconThumbDownTag } from '../../../../../nimble-components/src/icons/thumb-down';

const leftButtonsDescription = `Display buttons which the user can click to invoke additional actions at the left side. 
The buttons should have the \`ghost\` appearance and \`content-hidden\`.
 
For outbound message types, the buttons are only visible on hover.

Nimble will set the height of the buttons to \`$ni-nimble-control-slim-height\`.
`;

const bottomLeftButtonsDescription = `Display buttons which the user can click to invoke additional actions at the bottom-left side. 
The buttons should have the \`ghost\` appearance and \`content-hidden\`.

Nimble will set the height of the buttons to \`$ni-nimble-control-slim-height\`.
`;

const followUpPromptsDescription = 'Display buttons with followup prompts. They are below any action buttons.';

interface ChatMessageArgs {
    messageType: keyof typeof ChatMessageType;
    left: boolean;
    bottomLeft: boolean;
    followupPrompt: boolean;
}

const metadata: Meta<ChatMessageArgs> = {
    title: 'Internal/Chat Message',
    argTypes: {
        messageType: {
            name: 'message-type',
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The type of the chat message.',
            table: { category: apiCategory.attributes }
        },
        left: {
            description: leftButtonsDescription,
            table: { category: apiCategory.slots }
        },
        bottomLeft: {
            name: 'bottom-left',
            description: bottomLeftButtonsDescription,
            table: { category: apiCategory.slots }
        },
        followupPrompt: {
            name: 'followup-prompt',
            description: followUpPromptsDescription,
            table: { category: apiCategory.slots }
        }
    },
    parameters: {
        actions: {}
    }
};

export default metadata;

interface ChatMessageTextArgs extends ChatMessageArgs {
    text: string;
}

export const chatMessageText: StoryObj<ChatMessageTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            ${x => x.text}
            ${when(
        x => x.left,
        html`
                <${buttonTag} slot="left" appearance="ghost" content-hidden>
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Edit
                </${buttonTag}>`
    )}
            ${when(
        x => x.bottomLeft,
        html`
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>`
    )}
            ${when(
        x => x.followupPrompt,
        html`
                <${buttonTag} slot="followup-prompt">
                    Elaborate more
                </${buttonTag}>
                <${buttonTag} slot="followup-prompt">
                    Try again
                </${buttonTag}>`
    )}
        </${chatMessageTag}>
    `),
    argTypes: {
        text: {
            name: 'default',
            description: 'The content to display in the chat message.',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        text: 'Aurora Borealis? At this time of year? At this time of day? In this part of the country? Localized entirely within your kitchen?',
        messageType: 'outbound',
        left: false,
        bottomLeft: false,
        followupPrompt: false
    }
};

interface ChatMessageRichTextArgs extends ChatMessageArgs {
    markdown: string;
}
export const chatMessageRichText: StoryObj<ChatMessageRichTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${richTextViewerTag} markdown="${x => x.markdown}"></${richTextViewerTag}>
            ${when(
        x => x.left,
        html`
                <${buttonTag} slot="left" appearance="ghost" content-hidden>
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Edit
                </${buttonTag}>`
    )}
            ${when(
        x => x.bottomLeft,
        html`
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>`
    )}
            ${when(
        x => x.followupPrompt,
        html`
                <${buttonTag} slot="followup-prompt">
                    Elaborate more
                </${buttonTag}>
                <${buttonTag} slot="followup-prompt">
                    Try again
                </${buttonTag}>`
    )}
        </${chatMessageTag}>
    `),
    argTypes: {
        markdown: {
            description: 'Markdown text for the rich text viewer',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        markdown: markdownExample,
        messageType: 'outbound',
        left: false,
        bottomLeft: false,
        followupPrompt: false
    }
};

export const chatMessageSpinner: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${spinnerTag}
                style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
                appearance="${() => SpinnerAppearance.accent}"
            ></${spinnerTag}>
            ${when(
        x => x.left,
        html`
                <${buttonTag} slot="left" appearance="ghost" content-hidden>
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Edit
                </${buttonTag}>`
    )}
            ${when(
        x => x.bottomLeft,
        html`
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>`
    )}
            ${when(
        x => x.followupPrompt,
        html`
                <${buttonTag} slot="followup-prompt">
                    Elaborate more
                </${buttonTag}>
                <${buttonTag} slot="followup-prompt">
                    Try again
                </${buttonTag}>`
    )}
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'system',
        left: false,
        bottomLeft: false,
        followupPrompt: false
    }
};

export const chatMessageImage: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <img width="100" height="100" :src="${() => imgBlobUrl}">
            ${when(
        x => x.left,
        html`
                <${buttonTag} slot="left" appearance="ghost" content-hidden>
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Edit
                </${buttonTag}>`
    )}
            ${when(
        x => x.bottomLeft,
        html`
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>`
    )}
            ${when(
        x => x.followupPrompt,
        html`
                <${buttonTag} slot="followup-prompt">
                    Elaborate more
                </${buttonTag}>
                <${buttonTag} slot="followup-prompt">
                    Try again
                </${buttonTag}>`
    )}
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'inbound',
        left: false,
        bottomLeft: false,
        followupPrompt: false
    }
};

export const chatMessagePrompts: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${buttonTag} appearance="${() => ButtonAppearance.block}">Eat my shorts</${buttonTag}>
            <${buttonTag} appearance="${() => ButtonAppearance.block}">Do the Bartman</${buttonTag}>
            ${when(
        x => x.left,
        html`
                <${buttonTag} slot="left" appearance="ghost" content-hidden>
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Edit
                </${buttonTag}>`
    )}
            ${when(
        x => x.bottomLeft,
        html`
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="bottom-left" appearance="ghost" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>`
    )}
            ${when(
        x => x.followupPrompt,
        html`
                <${buttonTag} slot="followup-prompt">
                    Elaborate more
                </${buttonTag}>
                <${buttonTag} slot="followup-prompt">
                    Try again
                </${buttonTag}>`
    )}
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'system',
        left: false,
        bottomLeft: false,
        followupPrompt: false
    }
};
