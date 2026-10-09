import type { StoryFn, Meta } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { chatConversationTag } from '@ni/spright-components/dist/esm/chat/conversation';
import { chatMessageTag } from '@ni/spright-components/dist/esm/chat/message';
import { chatMessageInboundTag } from '@ni/spright-components/dist/esm/chat/message/inbound';
import { chatMessageOutboundTag } from '@ni/spright-components/dist/esm/chat/message/outbound';
import { chatMessageSystemTag } from '@ni/spright-components/dist/esm/chat/message/system';
import { chatMessageWelcomeTag } from '@ni/spright-components/dist/esm/chat/message/welcome';
import {
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';
import { textCustomizationWrapper } from '../../../utilities/text-customization';

const metadata: Meta = {
    title: 'Tests Spright/Chat Message',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

export const messageHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag}>
            <${chatMessageTag} hidden>Hidden Chat Message</${chatMessageTag}>
        </${chatConversationTag}>`
    )
);

export const messageTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatConversationTag}>
            <${chatMessageTag}>Message</${chatMessageTag}>
        </${chatConversationTag}>`
    )
);

export const messageInboundHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag}>
            <${chatMessageInboundTag} hidden>Hidden Chat Inbound Message</${chatMessageInboundTag}>
        </${chatConversationTag}>`
    )
);

export const messageInboundTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatConversationTag}>
            <${chatMessageInboundTag}>Inbound Message</${chatMessageInboundTag}>
        </${chatConversationTag}>`
    )
);

export const messageOutboundHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag}>
            <${chatMessageOutboundTag} hidden>Hidden Chat Outbound Message</${chatMessageOutboundTag}>
        </${chatConversationTag}>`
    )
);

export const messageOutboundTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatConversationTag}>
            <${chatMessageOutboundTag}>Outbound Message</${chatMessageOutboundTag}>
        </${chatConversationTag}>`
    )
);

export const messageSystemHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag}>
            <${chatMessageSystemTag} hidden>Hidden Chat System Message</${chatMessageSystemTag}>
        </${chatConversationTag}>`
    )
);

export const messageSystemTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatConversationTag}>
            <${chatMessageSystemTag}>System Message</${chatMessageSystemTag}>
        </${chatConversationTag}>`
    )
);

export const messageWelcomeHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag}>
            <${chatMessageWelcomeTag} hidden welcome-title="Welcome" subtitle="Get started">Hidden Chat Welcome Message</${chatMessageWelcomeTag}>
        </${chatConversationTag}>`
    )
);

export const messageWelcomeTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatConversationTag}>
            <${chatMessageWelcomeTag} welcome-title="Welcome" subtitle="Get started">Welcome Message</${chatMessageWelcomeTag}>
        </${chatConversationTag}>`
    )
);
