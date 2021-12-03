import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { MenuItem } from '@ni/nimble-components/dist/esm/menu-item';
import { toBooleanProperty } from '../utilities/template-value-helpers';
/**
 * Directive to provide Angular integration for the menu.
 */
@Directive({
    selector: 'nimble-menu-item'
})
export class NimbleMenuItemDirective {
    public get disabled(): boolean {
        return this.el.nativeElement.disabled;
    }

    @Input() public set disabled(value: boolean) {
        this.renderer.setProperty(this.el.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly el: ElementRef<MenuItem>) {}
}
