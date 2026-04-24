import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-ex-button': ExButton;
    }
}

/**
 * A Ok demo component (not for production use)
 */
export class ExButton extends FoundationElement {}

const okExButton = ExButton.compose({
    baseName: 'ex-button',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okExButton());
export const exButtonTag = 'ok-ex-button';
