import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { InternationalizationTable } from '@ni/nimble-components/dist/esm/i18n/table';

export type { InternationalizationTable };

/**
 * Directive for nimble-i18n-table to allow setting the label properties with customized strings
 */
@Directive({
    selector: 'nimble-i18n-table'
})
export class NimbleInternationalizationTableDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<InternationalizationTable>) {
    }

    public get tableGroupsCollapseAll(): string {
        return this.elementRef.nativeElement.tableGroupsCollapseAll;
    }

    @Input() public set tableGroupsCollapseAll(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'tableGroupsCollapseAll', value);
    }
}