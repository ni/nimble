import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { ButtonPattern } from '@ni/nimble-components/dist/esm/patterns/button/types';
import { toBooleanProperty, type BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import type { ButtonAppearance } from '../../public-api';

/**
 * Base class for components that implement the `ButtonPattern` interface
 */
@Directive()
export class NimbleButtonBaseDirective<T extends ButtonPattern> {
    public get appearance(): ButtonAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: ButtonAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get contentHidden(): boolean {
        return this.elementRef.nativeElement.contentHidden;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('content-hidden') public set contentHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'contentHidden', toBooleanProperty(value));
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<T>) {}
}