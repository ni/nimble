import type { StoryFn, Meta } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { chatMessageTag } from '@ni/spright-components/dist/esm/chat/message';
import { chatMessageInboundTag } from '@ni/spright-components/dist/esm/chat/message/inbound';
import { chatMessageOutboundTag } from '@ni/spright-components/dist/esm/chat/message/outbound';
import { chatMessageSystemTag } from '@ni/spright-components/dist/esm/chat/message/system';
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
        html`<${chatMessageTag} hidden>Hidden Chat Message</${chatMessageTag}>`
    )
);

export const messageTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatMessageTag}>Message</${chatMessageTag}>`
    )
);

export const messageInboundHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageInboundTag} hidden>Hidden Chat Inbound Message</${chatMessageInboundTag}>`
    )
);

export const messageInboundTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatMessageInboundTag}>Inbound Message</${chatMessageInboundTag}>`
    )
);

export const messageOutboundHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageOutboundTag} hidden>Hidden Chat Outbound Message</${chatMessageOutboundTag}>`
    )
);

export const messageOutboundTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatMessageOutboundTag}>Outbound Message</${chatMessageOutboundTag}>`
    )
);

export const messageSystemHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageSystemTag} hidden>Hidden Chat System Message</${chatMessageSystemTag}>`
    )
);

export const messageSystemTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatMessageSystemTag}>System Message</${chatMessageSystemTag}>`
    )
);
