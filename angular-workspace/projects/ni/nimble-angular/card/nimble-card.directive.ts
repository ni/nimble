import { Directive } from '@angular/core';
import { type Card, cardTag } from '@ni/nimble-components/dist/esm/card';

export type { Card };
export { cardTag };

/**
 * Directive to provide Angular integration for the card.
 */
@Directive({
    selector: 'nimble-card'
})

export class NimbleCardDirective {}
