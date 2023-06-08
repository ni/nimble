import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { InternationalizationTable } from '@ni/nimble-components/dist/esm/i18n/table';

import '@angular/localize/init';

/**
 * Directive for nimble-i18n-core which will initialize all of the label properties on this i18n provider.
 * The property values use $localize to request localization.
 */
@Directive({
    selector: 'nimble-i18n-table[withDefaults]'
})
export class NimbleInternationalizationTableWithDefaultsDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<InternationalizationTable>) {
        this.elementRef.nativeElement.tableGroupsCollapseAll = $localize`Collapse all groups`;
    }
}