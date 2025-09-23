import { html, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';

import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { chatMessageTag } from '@ni/spright-components/dist/esm/chat/message';
import { ChatMessageType } from '@ni/spright-components/dist/esm/chat/message/types';
import { chatMarkdownViewerTag } from '@ni/spright-components/dist/esm/chat/markdown-viewer';
import { spinnerTag } from '@ni/nimble-components/dist/esm/spinner';
import { SpinnerAppearance } from '@ni/nimble-components/dist/esm/spinner/types';
import { iconThumbUpTag } from '@ni/nimble-components/dist/esm/icons/thumb-up';
import { iconThumbDownTag } from '@ni/nimble-components/dist/esm/icons/thumb-down';
import { isChromatic } from '../../../utilities/isChromatic';
import { imgBlobUrl, markdownExample } from '../conversation/story-helpers';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

const footerActionsDescription = `Place 0 or more buttons at the bottom of the message to allow the user to invoke a custom action.
Footer actions should only be added to inbound messages.

The buttons should have the \`ghost\` appearance and \`content-hidden\`.

Nimble will set the height of the buttons to \`$ni-nimble-control-slim-height\`.
`;

const endButtonDescription = 'Place 0 or more buttons with text. They appear below any action buttons. End buttons should only be added to inbound messages.';

interface ChatMessageArgs {
    messageType: keyof typeof ChatMessageType;
    footerActions: boolean;
    endButtons: boolean;
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
        footerActions: {
            name: 'footer-actions',
            description: footerActionsDescription,
            table: { category: apiCategory.slots }
        },
        endButtons: {
            name: 'end',
            description: endButtonDescription,
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

// prettier-ignore
export const chatMessageText: StoryObj<ChatMessageTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            ${x => x.text}
            ${when(x => x.footerActions, html`
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Like" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Dislike" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>
            `)}
            ${when(x => x.endButtons, html`
                <${buttonTag} slot="end" appearance="block">
                    Order a tab
                </${buttonTag}>
                <${buttonTag} slot="end" appearance="block">
                    Check core temperature
                </${buttonTag}>
            `)}
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
        footerActions: false,
        endButtons: false
    }
};

interface ChatMessageRichTextArgs extends ChatMessageArgs {
    markdown: string;
}

// prettier-ignore
export const chatMessageRichText: StoryObj<ChatMessageRichTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${chatMarkdownViewerTag} markdown="${x => x.markdown}"></${chatMarkdownViewerTag}>
            ${when(x => x.footerActions, html`
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Like" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Dislike" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>
            `)}
            ${when(x => x.endButtons, html`
                <${buttonTag} slot="end" appearance="block">
                    Order a tab
                </${buttonTag}>
                <${buttonTag} slot="end" appearance="block">
                    Check core temperature
                </${buttonTag}>
            `)}
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
        footerActions: false,
        endButtons: false
    }
};

// prettier-ignore
export const chatMessageSpinner: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${spinnerTag}
                style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
                appearance="${() => SpinnerAppearance.accent}"
            ></${spinnerTag}>
            ${when(x => x.footerActions, html`
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Like" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Dislike" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>
            `)}
            ${when(x => x.endButtons, html`
                <${buttonTag} slot="end" appearance="block">
                    Order a tab
                </${buttonTag}>
                <${buttonTag} slot="end" appearance="block">
                    Check core temperature
                </${buttonTag}>
            `)}
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'system',
        footerActions: false,
        endButtons: false
    }
};

// prettier-ignore
export const chatMessageImage: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <img width="100" height="100" :src="${() => imgBlobUrl}">
            ${when(x => x.footerActions, html`
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Like" content-hidden>
                    <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                    Like
                </${buttonTag}>
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Dislike" content-hidden>
                    <${iconThumbDownTag} slot="start"></${iconThumbDownTag}>
                    Dislike
                </${buttonTag}>
            `)}
            ${when(x => x.endButtons, html`
                <${buttonTag} slot="end" appearance="block">
                    Order a tab
                </${buttonTag}>
                <${buttonTag} slot="end" appearance="block">
                    Check core temperature
                </${buttonTag}>
            `)}
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'inbound',
        footerActions: false,
        endButtons: false
    }
};
