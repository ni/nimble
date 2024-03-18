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
        this.elementRef.nativeElement.rowCollapse = $localize`:Nimble table - collapse row|:Collapse row`;
        this.elementRef.nativeElement.rowExpand = $localize`:Nimble table - expand row|:Expand row`;
        this.elementRef.nativeElement.collapseAll = $localize`:Nimble table - collapse all|:Collapse all`;
        this.elementRef.nativeElement.cellActionMenu = $localize`:Nimble table - cell action menu|:Options`;
        this.elementRef.nativeElement.columnHeaderGrouped = $localize`:Nimble table - column header grouped|:Grouped`;
        this.elementRef.nativeElement.columnHeaderSortedAscending = $localize`:Nimble table - column header sorted ascending|:Sorted ascending`;
        this.elementRef.nativeElement.columnHeaderSortedDescending = $localize`:Nimble table - column header sorted descending|:Sorted descending`;
        this.elementRef.nativeElement.selectAll = $localize`:Nimble table - select all rows|:Select all rows`;
        this.elementRef.nativeElement.groupSelectAll = $localize`:Nimble table - select all rows in group|:Select all rows in group`;
        this.elementRef.nativeElement.rowSelect = $localize`:Nimble table - select row|:Select row`;
        this.elementRef.nativeElement.rowOperationColumn = $localize`:Nimble table - row operation column|:Row operations`;
        this.elementRef.nativeElement.rowLoading = $localize`:Nimble table - row loading|:Loading`;
    }
}