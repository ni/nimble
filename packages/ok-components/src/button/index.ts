import { FoundationElement } from '@ni/fast-foundation';
import { customElement } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';

export const buttonTag = 'ok-button';

declare global {
    interface HTMLElementTagNameMap {
        [buttonTag]: Button;
    }
}

/**
 * A Ok demo component (not for production use)
 */
@customElement({
    name: buttonTag,
    template,
    styles
})
export class Button extends FoundationElement {}
