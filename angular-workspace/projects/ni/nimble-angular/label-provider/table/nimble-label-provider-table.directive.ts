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

    public get columnHeaderGroupedIndicator(): string | undefined {
        return this.elementRef.nativeElement.columnHeaderGroupedIndicator;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('column-header-grouped-indicator') public set columnHeaderGroupedIndicator(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHeaderGroupedIndicator', value);
    }
}