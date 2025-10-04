import { FoundationElement } from '@ni/fast-foundation';
import { customElement } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';

export const rectangleTag = 'spright-rectangle';

declare global {
    interface HTMLElementTagNameMap {
        [rectangleTag]: Rectangle;
    }
}

/**
 * A Spright demo component (not for production use)
 */
@customElement({
    name: rectangleTag,
    template,
    styles
})
export class Rectangle extends FoundationElement {}
