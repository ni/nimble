import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { LabelProviderTable } from '@ni/nimble-components/dist/esm/label-provider/table';

import '@angular/localize/init';

/**
 * Directive for nimble-label-provider-table which will initialize all of the labels with $localize-tagged strings, for apps
 * using @angular/localize.
 */
@Directive({
    selector: 'nimble-label-provider-table[withDefaults]'
})
export class NimbleLabelProviderTableWithDefaultsDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderTable>) {
        this.elementRef.nativeElement.groupCollapse = $localize`:Nimble table - collapse group|:Collapse group`;
        this.elementRef.nativeElement.groupExpand = $localize`:Nimble table - expand group|:Expand group`;
        this.elementRef.nativeElement.groupsCollapseAll = $localize`:Nimble table - collapse all groups|:Collapse all groups`;
        this.elementRef.nativeElement.cellActionMenu = $localize`:Nimble table - cell action menu|:Options`;
        this.elementRef.nativeElement.columnHeaderGroupedIndicator = $localize`:Nimble table - column header grouped indicator|:Grouped`;
    }
}