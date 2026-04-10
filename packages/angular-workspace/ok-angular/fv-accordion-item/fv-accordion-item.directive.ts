import { booleanAttribute, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvAccordionItem } from '@ni/ok-components/dist/esm/fv-accordion-item';
import { fvAccordionItemTag } from '@ni/ok-components/dist/esm/fv-accordion-item';
import { FvAccordionItemAppearance } from '@ni/ok-components/dist/esm/fv-accordion-item/types';

export type { FvAccordionItem };
export { fvAccordionItemTag };
export { FvAccordionItemAppearance };

/**
 * Directive to provide Angular integration for the accordion item.
 */
@Directive({
    selector: 'ok-fv-accordion-item',
    standalone: false
})
export class OkFvAccordionItemDirective {
    public get header(): string {
        return this.elementRef.nativeElement.header;
    }

    @Input()
    public set header(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'header', value);
    }

    public get expanded(): boolean {
        return this.elementRef.nativeElement.expanded;
    }

    @Input({ transform: booleanAttribute })
    public set expanded(value: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'expanded', value);
    }

    public get appearance(): FvAccordionItemAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input()
    public set appearance(value: FvAccordionItemAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvAccordionItem>,
        private readonly renderer: Renderer2
    ) {}
}
