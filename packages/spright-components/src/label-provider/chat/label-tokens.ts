import { DesignToken } from '@ni/fast-foundation';
import { chatLabelDefaults } from './label-token-defaults';

export const chatInputSendLabel = DesignToken.create<string>({
    name: 'chat-input-send-label',
    cssCustomPropertyName: null
}).withDefault(chatLabelDefaults.chatInputSendLabel);

export const chatInputStopLabel = DesignToken.create<string>({
    name: 'chat-input-stop-label',
    cssCustomPropertyName: null
}).withDefault(chatLabelDefaults.chatInputStopLabel);
