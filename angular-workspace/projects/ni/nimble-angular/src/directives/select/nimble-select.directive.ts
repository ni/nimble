import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Select } from '@ni/nimble-components/dist/esm/select';
import type { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';

export type { Select };

/**
 * Directive for Nimble select control Angular integration
 */
@Directive({
    selector: 'nimble-select',
})
export class NimbleSelectDirective {
    public get appearance(): DropdownAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: DropdownAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Select>) {}
}
