import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { DesignSystem } from '@ni/fast-foundation';
import { template } from './template';
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
export class IconNigelChat extends Icon {}

const sprightIconNigelChat = IconNigelChat.compose({
    baseName: 'icon-nigel-chat',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightIconNigelChat());

export const iconNigelChatTag = 'spright-icon-nigel-chat';
