import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import type { ListOptionGroup, listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';

export type { ListOptionGroup };
export { listOptionGroupTag };

/**
 * Directive to provide Angular integration for the list option group.
 */
@Directive({
    selector: 'nimble-list-option-group'
})
export class NimbleListOptionGroupDirective {
    public get label(): string | undefined {
        return this.elementRef.nativeElement.label;
    }

    @Input() public set label(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    public get hidden(): boolean {
        return this.elementRef.nativeElement.hidden;
    }

    @Input() public set hidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'hidden', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<ListOptionGroup>,
        private readonly renderer: Renderer2,
    ) { }
}
