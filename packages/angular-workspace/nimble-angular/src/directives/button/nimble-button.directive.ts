import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Button, buttonTag } from '@ni/nimble-components/dist/esm/button';
import type { ButtonType, ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/button/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Button };
export { buttonTag };
export type { ButtonType };

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

    @Input() public set appearance(value: ButtonAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get appearanceVariant(): ButtonAppearanceVariant {
        return this.elementRef.nativeElement.appearanceVariant;
    }

    @Input('appearance-variant') public set appearanceVariant(value: ButtonAppearanceVariant) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceVariant', value);
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

    public get contentHidden(): boolean {
        return this.elementRef.nativeElement.contentHidden;
    }

    @Input('content-hidden') public set contentHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'contentHidden', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Button>) {}
}
