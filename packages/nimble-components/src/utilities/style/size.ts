import type { Behavior, ElementStyles } from '@ni/fast-element';
import { MultivaluePropertyStyleSheetBehavior } from './multivalue-property-stylesheet-behavior';

/**
 * Behavior that will conditionally apply a stylesheet based on the element's
 * size property
 *
 * @param value - The value or values of the size property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
export function sizeBehavior<SizeType>(
    value: SizeType | SizeType[],
    styles: ElementStyles
): Behavior {
    return new MultivaluePropertyStyleSheetBehavior('size', value, styles);
}
