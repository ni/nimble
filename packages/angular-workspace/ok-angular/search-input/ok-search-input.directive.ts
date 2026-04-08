import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { SearchInput } from '@ni/ok-components/dist/esm/search-input';
import { searchInputTag } from '@ni/ok-components/dist/esm/search-input';
import { SearchInputAppearance } from '@ni/ok-components/dist/esm/search-input/types';

export type { SearchInput };
export { searchInputTag };
export { SearchInputAppearance };

/**
 * Directive to provide Angular integration for the search input.
 */
@Directive({
    selector: 'ok-search-input',
    standalone: false
})
export class OkSearchInputDirective {
    @Input()
    public set appearance(value: SearchInputAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    @Input()
    public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    @Input()
    public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<SearchInput>,
        private readonly renderer: Renderer2
    ) {}
}