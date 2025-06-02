import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Combobox, comboboxTag } from '@ni/nimble-components/dist/esm/combobox';
import { ComboboxAutocomplete } from '@ni/nimble-components/dist/esm/combobox/types';
import type { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Combobox };
export { comboboxTag };
export { ComboboxAutocomplete };

/**
 * Directive for Nimble combobox control Angular integration
 */
@Directive({
    selector: 'nimble-combobox',
})
export class NimbleComboboxDirective {
    public get appearance(): DropdownAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: DropdownAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get autocomplete(): ComboboxAutocomplete | undefined {
        return this.elementRef.nativeElement.autocomplete;
    }

    @Input() public set autocomplete(value: ComboboxAutocomplete | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'autocomplete', value);
    }

    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public get value(): string {
        return this.elementRef.nativeElement.value;
    }

    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    @Input() public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    public get requiredVisible(): boolean {
        return this.elementRef.nativeElement.requiredVisible;
    }

    @Input('required-visible') public set requiredVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'requiredVisible', toBooleanProperty(value));
    }

    public get appearanceReadOnly(): boolean {
        return this.elementRef.nativeElement.appearanceReadOnly;
    }

    @Input('appearance-readonly') public set appearanceReadOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceReadOnly', toBooleanProperty(value));
    }

    public get fullBleed(): boolean {
        return this.elementRef.nativeElement.fullBleed;
    }

    @Input('full-bleed') public set fullBleed(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fullBleed', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Combobox>) {}
}
