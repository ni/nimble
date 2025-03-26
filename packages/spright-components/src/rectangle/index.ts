import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
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
export class Rectangle extends FoundationElement {
    public textField?: TextField;
}

const sprightRectangle = Rectangle.compose({
    baseName: 'rectangle',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightRectangle());
export const rectangleTag = 'spright-rectangle';
