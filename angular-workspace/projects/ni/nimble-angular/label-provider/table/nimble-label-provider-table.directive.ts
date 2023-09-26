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

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('group-collapse') public set groupCollapse(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupCollapse', value);
    }

    public get groupExpand(): string | undefined {
        return this.elementRef.nativeElement.groupExpand;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('group-expand') public set groupExpand(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupExpand', value);
    }

    public get groupsCollapseAll(): string | undefined {
        return this.elementRef.nativeElement.groupsCollapseAll;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('groups-collapse-all') public set groupsCollapseAll(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupsCollapseAll', value);
    }

    public get cellActionMenu(): string | undefined {
        return this.elementRef.nativeElement.cellActionMenu;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('cell-action-menu') public set cellActionMenu(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'cellActionMenu', value);
    }

    public get columnHeaderGrouped(): string | undefined {
        return this.elementRef.nativeElement.columnHeaderGrouped;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('column-header-grouped') public set columnHeaderGrouped(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHeaderGrouped', value);
    }

    public get columnHeaderSortedAscending(): string | undefined {
        return this.elementRef.nativeElement.columnHeaderSortedAscending;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('column-header-sorted-ascending') public set columnHeaderSortedAscending(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHeaderSortedAscending', value);
    }

    public get columnHeaderSortedDescending(): string | undefined {
        return this.elementRef.nativeElement.columnHeaderSortedDescending;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('column-header-sorted-descending') public set columnHeaderSortedDescending(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHeaderSortedDescending', value);
    }

    public get selectAll(): string | undefined {
        return this.elementRef.nativeElement.selectAll;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('select-all') public set selectAll(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectAll', value);
    }

    public get groupSelectAll(): string | undefined {
        return this.elementRef.nativeElement.groupSelectAll;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('group-select-all') public set groupSelectAll(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupSelectAll', value);
    }

    public get rowSelect(): string | undefined {
        return this.elementRef.nativeElement.rowSelect;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('row-select') public set rowSelect(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rowSelect', value);
    }

    public get rowOperationColumn(): string | undefined {
        return this.elementRef.nativeElement.rowOperationColumn;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('row-operation-column') public set rowOperationColumn(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rowOperationColumn', value);
    }
}