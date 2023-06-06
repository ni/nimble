import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Tab } from '@ni/nimble-components/dist/esm/tab';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Tab };

/**
 * Directive to provide Angular integration for the tab element.
 */
@Directive({
    selector: 'nimble-tab'
})
export class NimbleTabDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Tab>) {}
}
