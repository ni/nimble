import { attr } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import {
    type DesignTokensFor,
    LabelProviderBase
} from '@ni/nimble-components/dist/esm/label-provider/base';
import { styles } from '@ni/nimble-components/dist/esm/label-provider/base/styles';
import { chatSendLabel, chatStopLabel } from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'spright-label-provider-chat': LabelProviderChat;
    }
}

const supportedLabels = {
    send: chatSendLabel,
    stop: chatStopLabel
} as const;

/**
 * Label provider for Spright chat components
 */
export class LabelProviderChat
    extends LabelProviderBase<typeof supportedLabels>
    implements DesignTokensFor<typeof supportedLabels> {
    @attr
    public send: string | undefined;

    @attr
    public stop: string | undefined;

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