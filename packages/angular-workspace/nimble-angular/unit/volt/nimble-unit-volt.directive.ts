import { Directive } from '@angular/core';
import { type UnitVolt, unitVoltTag } from '@ni/nimble-components/dist/esm/unit/volt';

export type { UnitVolt };
export { unitVoltTag };

/**
 * Directive to provide Angular integration for the volt unit element used by the number-text column.
 */
@Directive({
    selector: 'nimble-unit-volt'
})
export class NimbleUnitVoltDirective {
}