import { Directive } from '@angular/core';
import { type Rectangle, rectangleTag } from '@ni/spright-components/dist/esm/rectangle';

export type { Rectangle };
export { rectangleTag };

/**
 * Directive to provide Angular integration for the rectangle.
 */
@Directive({
    selector: 'spright-rectangle'
})
export class SprightRectangleDirective { }
