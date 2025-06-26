import { Directive } from '@angular/core';
import { type UnitFahrenheit, unitFahrenheitTag } from '@ni/nimble-components/dist/esm/unit/fahrenheit';

export type { UnitFahrenheit };
export { unitFahrenheitTag };

/**
 * Directive to provide Angular integration for the Fahrenheit unit element used by the number-text column.
 */
@Directive({
    selector: 'nimble-unit-fahrenheit'
})
export class NimbleUnitFahrenheitDirective {
}