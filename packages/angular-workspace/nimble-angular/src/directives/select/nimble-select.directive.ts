import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Select, selectTag } from '@ni/nimble-components/dist/esm/select';
import { FilterMode, type SelectFilterInputEventDetail } from '@ni/nimble-components/dist/esm/select/types';
import type { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Select };
export { FilterMode, type SelectFilterInputEventDetail };
export { selectTag };

/**
 * Directive for Nimble select control Angular integration
 */
@Directive({
    selector: 'nimble-select',
})
export class NimbleSelectDirective {
    public get appearance(): DropdownAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: DropdownAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get filterMode(): FilterMode {
        return this.elementRef.nativeElement.filterMode;
    }

    @Input('filter-mode') public set filterMode(value: FilterMode) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'filterMode', value);
    }

    public get clearable(): boolean {
        return this.elementRef.nativeElement.clearable;
    }

    @Input() public set clearable(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'clearable', toBooleanProperty(value));
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get readOnly(): boolean {
        return this.elementRef.nativeElement.readOnly;
    }

    // readOnly property maps to the readonly attribute
    // See: https://github.com/microsoft/fast/blob/46bb6d9aab2c37105f4434db3795e176c2354a4f/packages/web-components/fast-foundation/src/text-field/text-field.ts#L33
    @Input('readonly') public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
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

    public get loadingVisible(): boolean {
        return this.elementRef.nativeElement.loadingVisible;
    }

    @Input('loading-visible') public set loadingVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'loadingVisible', toBooleanProperty(value));
    }

    public get requiredVisible(): boolean {
        return this.elementRef.nativeElement.requiredVisible;
    }

    @Input('required-visible') public set requiredVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'requiredVisible', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Select>) {}
}
