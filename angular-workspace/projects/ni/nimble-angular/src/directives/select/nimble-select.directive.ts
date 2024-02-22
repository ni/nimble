import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Select, selectTag } from '@ni/nimble-components/dist/esm/select';
import { FilterMode } from '@ni/nimble-components/dist/esm/select/types';
import type { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Select };
export { FilterMode };
export { selectTag };

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

    public get filterMode(): FilterMode {
        return this.elementRef.nativeElement.filterMode;
    }

    @Input('filter-mode') public set filterMode(value: FilterMode) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'filterMode', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Select>) {}
}
