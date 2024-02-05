import { Directive } from '@angular/core';
import { type WaferMap, waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';

export type { WaferMap };
export { waferMapTag };

/**
 * Directive to provide Angular integration for the wafermap.
 */
@Directive({
    selector: 'nimble-wafer-map'
})
export class NimbleWaferMapDirective { }
