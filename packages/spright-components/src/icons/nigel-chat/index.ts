import { messagesSparkle16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { IconSvg } from '@ni/nimble-components/dist/esm/icon-svg';
import { template } from '@ni/nimble-components/dist/esm/icon-svg/template';
import { DesignSystem } from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-icon-nigel-chat': IconNigelChat;
    }
}

/**
 * Spright Nigel chat brand icon.
 * Used as the default brand icon in the welcome message.
 */
export class IconNigelChat extends IconSvg {
    public constructor() {
        super(messagesSparkle16X16);
    }
}

const sprightIconNigelChat = IconNigelChat.compose({
    baseName: 'icon-nigel-chat',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconNigelChat());

export const iconNigelChatTag = 'spright-icon-nigel-chat';
