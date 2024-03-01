import { Directive } from '@angular/core';
import { type Accordion, accordionTag } from '@ni/spright-components/dist/esm/accordion';

export type { Accordion };
export { accordionTag };

/**
 * Directive to provide Angular integration for the accordion.
 */
@Directive({
    selector: 'spright-accordion'
})
export class SprightAccordionDirective { }
