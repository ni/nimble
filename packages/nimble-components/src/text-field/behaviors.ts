import { PropertyStyleSheetBehavior } from '@microsoft/fast-foundation';
import type { Behavior, ElementStyles } from '@microsoft/fast-element';

/**
 * Behavior that will conditionally apply a stylesheet based on the element's
 * invalid property
 *
 * @param value - The value of the invalid property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
export function invalidBehavior(
    value: boolean,
    styles: ElementStyles
): Behavior {
    return new PropertyStyleSheetBehavior('invalid', value, styles);
}
