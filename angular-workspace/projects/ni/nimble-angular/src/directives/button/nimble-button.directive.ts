import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { Button } from '@ni/nimble-components/dist/esm/button';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { toBooleanProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for the button.
 */
@Directive({
    selector: 'nimble-button'
})
export class NimbleButtonDirective {
    public get appearance(): ButtonAppearance {
        return this.el.nativeElement.appearance;
    }

    @Input() public set appearance(value: ButtonAppearance) {
        this.renderer.setProperty(this.el.nativeElement, 'appearance', value);
    }

    public get disabled(): boolean {
        return this.el.nativeElement.disabled;
    }

    @Input() public set disabled(value: boolean) {
        this.renderer.setProperty(this.el.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly el: ElementRef<Button>) {}
}
