import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Combobox } from '@ni/nimble-components/dist/esm/combobox';
import { ComboboxAutocomplete } from '@ni/nimble-components/dist/esm/combobox/types';
import type { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Combobox };
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

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Combobox>) {}
}
