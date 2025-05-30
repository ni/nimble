import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type MenuItem, menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { MenuItem };
export { menuItemTag };

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
