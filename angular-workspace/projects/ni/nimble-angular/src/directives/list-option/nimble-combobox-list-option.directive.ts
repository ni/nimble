import { Directive, ElementRef, Host, Inject, Input, Optional, Renderer2, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleComboboxControlValueAccessorDirective } from '../combobox/nimble-combobox-control-value-accessor.directive';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for the list option when used with a combobox.
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleComboboxListOptionDirective implements AfterViewInit, OnDestroy {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    /**
     * @description
     * Tracks the value bound to the option element.
     */
    @Input()
    public set ngValue(value: unknown) {
        if (this.combobox) {
            this._modelValue = value;
            this.updateComboboxValue(value);
        }
    }

    private _modelValue: unknown = undefined;
    private _currentTextContent: string;

    public constructor(
        private readonly elementRef: ElementRef<ListOption>,
        private readonly renderer: Renderer2,
        private readonly changeDetector: ChangeDetectorRef,
        @Inject(NimbleComboboxControlValueAccessorDirective) @Optional() @Host() private readonly combobox?: NimbleComboboxControlValueAccessorDirective
    ) { }

    public ngAfterViewInit(): void {
        if (this.combobox) {
            this._currentTextContent = this.elementRef.nativeElement.text;
            this.combobox.addOption(this._currentTextContent, this._modelValue);
        }
    }

    public ngOnDestroy(): void {
        if (this.combobox) {
            this.combobox.removeOption(this._currentTextContent);
        }
    }

    private updateComboboxValue(value: unknown): void {
        this.combobox!.removeOption(this._currentTextContent);
        this.changeDetector.detectChanges();
        this._currentTextContent = this.elementRef.nativeElement.text;
        this.combobox!.addOption(this._currentTextContent, value);
    }
}
