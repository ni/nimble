import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ToggleButton, toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';
import type { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/toggle-button/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { ToggleButton };
export { toggleButtonTag };

/**
 * Directive to provide Angular integration for the toggle button.
 */
@Directive({
    selector: 'nimble-toggle-button'
})
export class NimbleToggleButtonDirective {
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

    public get contentHidden(): boolean {
        return this.elementRef.nativeElement.contentHidden;
    }

    @Input('content-hidden') public set contentHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'contentHidden', toBooleanProperty(value));
    }

    public get checked(): boolean {
        return this.elementRef.nativeElement.checked;
    }

    @Input() public set checked(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ToggleButton>) {}
}
