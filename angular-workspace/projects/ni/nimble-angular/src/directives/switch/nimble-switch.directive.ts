import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Switch } from '@ni/nimble-components/dist/esm/switch';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Switch };

/**
 * Directive to provide Angular integration for the switch.
 */
@Directive({
    selector: 'nimble-switch'
})
export class NimbleSwitchDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get checked(): boolean {
        return this.elementRef.nativeElement.checked;
    }

    @Input() public set checked(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Switch>) {}
}
