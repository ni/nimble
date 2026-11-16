import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvToolbar } from '@ni/ok-components/dist/esm/fv/toolbar';
import { fvToolbarTag } from '@ni/ok-components/dist/esm/fv/toolbar';

export type { FvToolbar };
export { fvToolbarTag };

/** Angular bindings for the FV toolbar. */
@Directive({
    selector: 'ok-fv-toolbar',
    standalone: false
})
export class OkFvToolbarDirective {
    @Input() public set overflowLabel(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'overflowLabel', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvToolbar>,
        private readonly renderer: Renderer2
    ) {}
}
