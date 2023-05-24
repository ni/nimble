import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { MenuItem } from '@ni/nimble-components/dist/esm/menu-item';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { MenuItem };

/**
 * Directive to provide Angular integration for the menu.
 */
@Directive({
    selector: 'nimble-menu-item'
})
export class NimbleMenuItemDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<MenuItem>) {}
}
