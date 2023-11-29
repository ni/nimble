import type { Behavior, ElementStyles } from '@microsoft/fast-element';
import { MultivaluePropertyStyleSheetBehavior } from './multivalue-property-stylesheet-behavior';

/**
 * Behavior that will conditionally apply a stylesheet based on the element's
 * appearance property
 *
 * @param value - The value or values of the appearance property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
export function appearanceBehavior<AppearanceType>(
    value: AppearanceType | AppearanceType[],
    styles: ElementStyles
): Behavior {
    return new MultivaluePropertyStyleSheetBehavior(
        'appearance',
        value,
        styles
    );
}
