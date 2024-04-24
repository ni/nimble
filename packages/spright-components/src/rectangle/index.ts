import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-rectangle': Rectangle;
    }
}

/**
 * A Spright demo component (not for production use)
 */
export class Rectangle extends FoundationElement {}

const sprightRectangle = Rectangle.compose({
    baseName: 'rectangle',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightRectangle());
export const rectangleTag = 'spright-rectangle';
