import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type MenuButton, menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import type { ButtonAppearance, ButtonAppearanceVariant, MenuButtonToggleEventDetail } from '@ni/nimble-components/dist/esm/menu-button/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { MenuButton };
export { menuButtonTag };
export type { MenuButtonToggleEventDetail };

/**
 * Directive to provide Angular integration for the menu button.
 */
@Directive({
    selector: 'nimble-menu-button'
})
export class NimbleMenuButtonDirective {
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

    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    @Input() public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<MenuButton>) {}
}
