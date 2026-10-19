import { DesignToken } from '@ni/fast-foundation';
import { chatLabelDefaults } from './label-token-defaults';

export const chatSendLabel = DesignToken.create<string>({
    name: 'chat-send-label',
    cssCustomPropertyName: null
}).withDefault(chatLabelDefaults.chatSendLabel);

export const chatStopLabel = DesignToken.create<string>({
    name: 'chat-stop-label',
    cssCustomPropertyName: null
}).withDefault(chatLabelDefaults.chatStopLabel);