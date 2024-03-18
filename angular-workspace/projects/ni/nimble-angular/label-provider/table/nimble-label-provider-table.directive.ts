import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { LabelProviderTable } from '@ni/nimble-components/dist/esm/label-provider/table';

export type { LabelProviderTable };

/**
 * Directive to provide Angular integration for the nimble-table label provider.
 * To use the Nimble-provided strings declared via $localize, instead use NimbleLabelProviderTableWithDefaultsDirective.
 */
@Directive({
    selector: 'nimble-label-provider-table'
})
export class NimbleLabelProviderTableDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderTable>) {
    }

    public get groupCollapse(): string | undefined {
        return this.elementRef.nativeElement.groupCollapse;
    }

    @Input('group-collapse') public set groupCollapse(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupCollapse', value);
    }

    public get groupExpand(): string | undefined {
        return this.elementRef.nativeElement.groupExpand;
    }

    @Input('group-expand') public set groupExpand(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupExpand', value);
    }

    public get rowCollapse(): string | undefined {
        return this.elementRef.nativeElement.rowCollapse;
    }

    @Input('row-collapse') public set rowCollapse(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rowCollapse', value);
    }

    public get rowExpand(): string | undefined {
        return this.elementRef.nativeElement.rowExpand;
    }

    @Input('row-expand') public set rowExpand(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rowExpand', value);
    }

    public get collapseAll(): string | undefined {
        return this.elementRef.nativeElement.collapseAll;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('collapse-all') public set collapseAll(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'collapseAll', value);
    }

    public get cellActionMenu(): string | undefined {
        return this.elementRef.nativeElement.cellActionMenu;
    }

    @Input('cell-action-menu') public set cellActionMenu(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'cellActionMenu', value);
    }

    public get columnHeaderGrouped(): string | undefined {
        return this.elementRef.nativeElement.columnHeaderGrouped;
    }

    @Input('column-header-grouped') public set columnHeaderGrouped(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHeaderGrouped', value);
    }

    public get columnHeaderSortedAscending(): string | undefined {
        return this.elementRef.nativeElement.columnHeaderSortedAscending;
    }

    @Input('column-header-sorted-ascending') public set columnHeaderSortedAscending(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHeaderSortedAscending', value);
    }

    public get columnHeaderSortedDescending(): string | undefined {
        return this.elementRef.nativeElement.columnHeaderSortedDescending;
    }

    @Input('column-header-sorted-descending') public set columnHeaderSortedDescending(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHeaderSortedDescending', value);
    }

    public get selectAll(): string | undefined {
        return this.elementRef.nativeElement.selectAll;
    }

    @Input('select-all') public set selectAll(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectAll', value);
    }

    public get groupSelectAll(): string | undefined {
        return this.elementRef.nativeElement.groupSelectAll;
    }

    @Input('group-select-all') public set groupSelectAll(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupSelectAll', value);
    }

    public get rowSelect(): string | undefined {
        return this.elementRef.nativeElement.rowSelect;
    }

    @Input('row-select') public set rowSelect(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rowSelect', value);
    }

    public get rowOperationColumn(): string | undefined {
        return this.elementRef.nativeElement.rowOperationColumn;
    }

    @Input('row-operation-column') public set rowOperationColumn(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rowOperationColumn', value);
    }

    public get rowLoading(): string | undefined {
        return this.elementRef.nativeElement.rowLoading;
    }

    @Input('row-loading') public set rowLoading(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rowLoading', value);
    }
}