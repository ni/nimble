import { Behavior, ElementStyles } from '@microsoft/fast-element';
import { PropertyStyleSheetBehavior } from '@microsoft/fast-foundation';
import { ButtonAppearance } from '../button/types';

/**
 * Behavior that will conditionally apply a stylesheet based on the element's
 * appearance property
 *
 * @param value - The value of the appearance property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
export function appearanceBehavior(value: ButtonAppearance, styles: ElementStyles): Behavior {
    return new PropertyStyleSheetBehavior('appearance', value, styles);
}
