import { PropertyStyleSheetBehavior } from '@microsoft/fast-foundation';
import type { Behavior, ElementStyles } from '@microsoft/fast-element';

/**
 * Behavior that will conditionally apply a stylesheet based on the element's
 * appearance property
 *
 * @param value - The value of the appearance property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
export function appearanceBehavior<AppearanceType>(
    value: AppearanceType,
    styles: ElementStyles
): Behavior {
    return new PropertyStyleSheetBehavior('appearance', value, styles);
}
