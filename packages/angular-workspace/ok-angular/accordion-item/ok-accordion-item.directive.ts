import { booleanAttribute, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { AccordionItem } from '@ni/ok-components/dist/esm/accordion-item';
import { accordionItemTag } from '@ni/ok-components/dist/esm/accordion-item';
import { AccordionItemAppearance } from '@ni/ok-components/dist/esm/accordion-item/types';

export type { AccordionItem };
export { accordionItemTag };
export { AccordionItemAppearance };

/**
 * Directive to provide Angular integration for the accordion item.
 */
@Directive({
    selector: 'ok-accordion-item',
    standalone: false
})
export class OkAccordionItemDirective {
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

    public get appearance(): AccordionItemAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input()
    public set appearance(value: AccordionItemAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<AccordionItem>,
        private readonly renderer: Renderer2
    ) {}
}
