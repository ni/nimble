import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Button } from '@ni/nimble-components/dist/esm/button';
import type { ButtonAppearanceAttribute, ButtonType } from '@ni/nimble-components/dist/esm/button/types';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Button, ButtonType };
export { ButtonAppearance };

/**
 * Directive to provide Angular integration for the button.
 */
@Directive({
    selector: 'nimble-button'
})
export class NimbleButtonDirective {
    public get appearance(): ButtonAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: ButtonAppearance | ButtonAppearanceAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get type(): ButtonType {
        return this.elementRef.nativeElement.type;
    }

    @Input() public set type(value: ButtonType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Button>) {}
}
