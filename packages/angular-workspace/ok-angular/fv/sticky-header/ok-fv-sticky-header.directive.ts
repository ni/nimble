import { Directive, ElementRef } from '@angular/core';
import type { FvStickyHeader } from '@ni/ok-components/dist/esm/fv/sticky-header';
import { fvStickyHeaderTag } from '@ni/ok-components/dist/esm/fv/sticky-header';

export type { FvStickyHeader };
export { fvStickyHeaderTag };

/**
 * Directive to provide Angular integration for the sticky header.
 */
@Directive({
    selector: 'ok-fv-sticky-header',
    standalone: false
})
export class OkFvStickyHeaderDirective {
    public constructor(private readonly elementRef: ElementRef<FvStickyHeader>) {}
}
