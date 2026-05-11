import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvSplitButton } from '@ni/ok-components/dist/esm/fv/split-button';
import { fvSplitButtonTag } from '@ni/ok-components/dist/esm/fv/split-button';
import { FvSplitButtonAppearance, FvSplitButtonAppearanceVariant } from '@ni/ok-components/dist/esm/fv/split-button/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvSplitButton };
export { fvSplitButtonTag };
export { FvSplitButtonAppearance, FvSplitButtonAppearanceVariant };

/**
 * Directive to provide Angular integration for the split button.
 */
@Directive({
    selector: 'ok-fv-split-button',
    standalone: false
})
export class OkFvSplitButtonDirective {
    public get label(): string {
        return this.elementRef.nativeElement.label;
    }

    @Input()
    public set label(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input()
    public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    @Input()
    public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    public get appearance(): FvSplitButtonAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input()
    public set appearance(value: FvSplitButtonAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get appearanceVariant(): FvSplitButtonAppearanceVariant {
        return this.elementRef.nativeElement.appearanceVariant;
    }

    @Input('appearance-variant')
    public set appearanceVariant(value: FvSplitButtonAppearanceVariant) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceVariant', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvSplitButton>,
        private readonly renderer: Renderer2
    ) {}
}
