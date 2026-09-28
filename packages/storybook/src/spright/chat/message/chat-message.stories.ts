import { html, when } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';

import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { chatMessageInboundTag } from '@ni/spright-components/dist/esm/chat/message/inbound';
import { chatMessageOutboundTag } from '@ni/spright-components/dist/esm/chat/message/outbound';
import { chatMessageSystemTag } from '@ni/spright-components/dist/esm/chat/message/system';
import { chatMessageToolSummaryTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary';
import { chatToolCallTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary/tool-call';
import { chatToolCallInputTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary/tool-call-input';
import { richTextViewerTag } from '@ni/nimble-components/dist/esm/rich-text/viewer';
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

interface ChatMessageInboundArgs {
    footerActions: boolean;
    endButtons: boolean;
}

interface ChatMessageToolSummaryArgs {
    expanded: boolean;
    content: undefined;
}

const metadata: Meta<ChatMessageInboundArgs> = {
    title: 'Internal/Chat Message',
    argTypes: {
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

interface ChatMessageTextArgs {
    text: string;
}

export const chatMessageText: StoryObj<ChatMessageTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageOutboundTag}>
            ${x => x.text}
        </${chatMessageInboundTag}>
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
    }
};

interface ChatMessageRichTextArgs extends ChatMessageInboundArgs {
    markdown: string;
}

export const chatMessageRichText: StoryObj<ChatMessageRichTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageInboundTag}>
            <${richTextViewerTag} markdown="${x => x.markdown}"></${richTextViewerTag}>
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
        </${chatMessageInboundTag}>
    `),
    argTypes: {
        markdown: {
            description: 'Markdown text for the rich text viewer',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        markdown: markdownExample,
        footerActions: false,
        endButtons: false
    }
};

export const chatMessageSpinner: StoryObj = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageSystemTag}>
            <${spinnerTag}
                style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
                appearance="${() => SpinnerAppearance.accent}"
            ></${spinnerTag}>
        </${chatMessageSystemTag}>
    `)
};

export const chatMessageImage: StoryObj<ChatMessageInboundArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageInboundTag}>
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
        </${chatMessageInboundTag}>
    `),
    args: {
        footerActions: false,
        endButtons: false
    }
};

export const chatMessageToolSummary: StoryObj<ChatMessageToolSummaryArgs> = {
    render: createUserSelectedThemeStory(html<ChatMessageToolSummaryArgs>`
        <div style="width: min(560px, 100%); ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused;' : ''}">
            <${chatMessageToolSummaryTag} ?expanded="${x => x.expanded}">
                <${chatToolCallTag} name="systemlink.systems.search_systems" status="pending">
                    <${chatToolCallInputTag} name="filter" value='workspace: "engineering"'></${chatToolCallInputTag}>
                    <${chatToolCallInputTag} name="take" value="25" value-type="number"></${chatToolCallInputTag}>
                </${chatToolCallTag}>
                <${chatToolCallTag} name="systemlink.assets.search_assets" status="success">
                    <${chatToolCallInputTag} name="projection" value='["id","name","serialNumber"]' value-type="json"></${chatToolCallInputTag}>
                </${chatToolCallTag}>
            </${chatMessageToolSummaryTag}>
        </div>
    `),
    argTypes: {
        expanded: {
            description: 'Whether the ordered tool-call list is visible.',
            control: { type: 'boolean' },
            table: { category: apiCategory.attributes }
        },
        content: {
            name: 'default',
            description: `Place ordered \`${chatToolCallTag}\` elements in the default slot. Unrelated elements are ignored when deriving status and count.`,
            table: { category: apiCategory.slots }
        }
    },
    args: {
        expanded: false
    }
};
