import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import type { ListOption, listOptionTag } from '@ni/nimble-components/dist/esm/list-option';

export type { ListOption };
export { listOptionTag };

/**
 * Directive to provide Angular integration for the list option.
 *
 * This directive contains the properties that are on the `nimble-list-option` nimble component, but it
 * does not contain any Angular-specific form integration logic. The form integration logic is contained
 * in separate directives for each component that can contain a `nimble-list-option`
 * (e.g. `nimble-combobox-list-option.directive.ts` and `nimble-select-list-option.directive.ts`).
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleListOptionDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<ListOption>,
        private readonly renderer: Renderer2,
    ) { }
}
