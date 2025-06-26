import { Directive } from '@angular/core';
import { type UnitCelsius, unitCelsiusTag } from '@ni/nimble-components/dist/esm/unit/celsius';

export type { UnitCelsius };
export { unitCelsiusTag };

/**
 * Directive to provide Angular integration for the Celsius unit element used by the number-text column.
 */
@Directive({
    selector: 'nimble-unit-celsius'
})
export class NimbleUnitCelsiusDirective {
}