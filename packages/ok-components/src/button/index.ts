import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-button': Button;
    }
}

/**
 * A Ok demo component (not for production use)
 */
export class Button extends FoundationElement {}

const okButton = Button.compose({
    baseName: 'button',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okButton());
export const buttonTag = 'ok-button';
