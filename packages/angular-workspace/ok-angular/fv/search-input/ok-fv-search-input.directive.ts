import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvSearchInput } from '@ni/ok-components/dist/esm/fv/search-input';
import { fvSearchInputTag } from '@ni/ok-components/dist/esm/fv/search-input';
import { FvSearchInputAppearance } from '@ni/ok-components/dist/esm/fv/search-input/types';

export type { FvSearchInput };
export { fvSearchInputTag };
export { FvSearchInputAppearance };

/**
 * Directive to provide Angular integration for the FV search input.
 */
@Directive({
    selector: 'ok-fv-search-input',
    standalone: false
})
export class OkFvSearchInputDirective {
    public get appearance(): FvSearchInputAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input()
    public set appearance(value: FvSearchInputAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input()
    public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get value(): string {
        return this.elementRef.nativeElement.value;
    }

    @Input()
    public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvSearchInput>,
        private readonly renderer: Renderer2
    ) {}
}