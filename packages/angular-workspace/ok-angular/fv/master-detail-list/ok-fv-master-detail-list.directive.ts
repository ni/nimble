import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvMasterDetailList } from '@ni/ok-components/dist/esm/fv/master-detail-list';
import { fvMasterDetailListTag } from '@ni/ok-components/dist/esm/fv/master-detail-list';

export type { FvMasterDetailList };
export { fvMasterDetailListTag };

/**
 * Directive to provide Angular integration for the master-detail list.
 */
@Directive({
    selector: 'ok-fv-master-detail-list',
    standalone: false
})
export class OkFvMasterDetailListDirective {
    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input()
    public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvMasterDetailList>,
        private readonly renderer: Renderer2
    ) {}
}