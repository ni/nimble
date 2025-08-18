import { attr } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import {
    type DesignTokensFor,
    LabelProviderBase
} from '@ni/nimble-components/dist/esm/label-provider/base';
import { styles } from '@ni/nimble-components/dist/esm/label-provider/base/styles';
import { chatInputSendLabel, chatInputStopLabel } from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'spright-label-provider-chat': LabelProviderChat;
    }
}

const supportedLabels = {
    chatInputSend: chatInputSendLabel,
    chatInputStop: chatInputStopLabel
} as const;

/**
 * Core label provider for Nimble
 */
export class LabelProviderChat
    extends LabelProviderBase<typeof supportedLabels>
    implements DesignTokensFor<typeof supportedLabels> {
    @attr({ attribute: 'chat-input-send' })
    public chatInputSend: string | undefined;

    @attr({ attribute: 'chat-input-stop' })
    public chatInputStop: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const sprightLabelProviderChat = LabelProviderChat.compose({
    baseName: 'label-provider-chat',
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightLabelProviderChat());
export const labelProviderChatTag = 'spright-label-provider-chat';
