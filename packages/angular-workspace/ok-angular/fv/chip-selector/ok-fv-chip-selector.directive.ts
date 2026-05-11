import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvChipSelector } from '@ni/ok-components/dist/esm/fv/chip-selector';
import { fvChipSelectorTag } from '@ni/ok-components/dist/esm/fv/chip-selector';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvChipSelector };
export { fvChipSelectorTag };

/**
 * Directive to provide Angular integration for the chip selector.
 */
@Directive({
    selector: 'ok-fv-chip-selector',
    standalone: false
})
export class OkFvChipSelectorDirective {
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

    public get label(): string {
        return this.elementRef.nativeElement.label;
    }

    @Input()
    public set label(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    public get selectedValues(): string {
        return this.elementRef.nativeElement.selectedValues;
    }

    @Input()
    public set selectedValues(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectedValues', value);
    }

    public get options(): string {
        return this.elementRef.nativeElement.options;
    }

    @Input()
    public set options(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'options', value);
    }

    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input()
    public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get allowCustomValues(): boolean {
        return this.elementRef.nativeElement.allowCustomValues;
    }

    @Input()
    public set allowCustomValues(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'allowCustomValues', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<FvChipSelector>,
        private readonly renderer: Renderer2
    ) {}
}
