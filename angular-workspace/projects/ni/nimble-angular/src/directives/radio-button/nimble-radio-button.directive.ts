import { Directive, ElementRef, Host, Inject, Input, Renderer2, OnDestroy } from '@angular/core';
import type { RadioButton } from '@ni/nimble-components/dist/esm/radio-button';
import { NimbleRadioGroupControlValueAccessorDirective } from '../radio-group/nimble-radio-group-control-value-accessor.directive';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for a radio button in a radio group.
 */
@Directive({
    selector: 'nimble-radio-button'
})
export class NimbleRadioButtonDirective implements OnDestroy {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    /**
     * @description
     * Updates the model value associated with this button in the parent radio group.
     */
    @Input()
    public set ngValue(value: unknown) {
        this.radioGroup.removeRadioButton(this._id);
        this.radioGroup.addRadioButton(this._id, value);
    }

    private readonly _id: string = '-1';

    public constructor(
        private readonly elementRef: ElementRef<RadioButton>,
        private readonly renderer: Renderer2,
        @Inject(NimbleRadioGroupControlValueAccessorDirective) @Host() private readonly radioGroup: NimbleRadioGroupControlValueAccessorDirective
    ) {
        this._id = this.radioGroup.getRadioButtonId();
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', this._id);
    }

    public ngOnDestroy(): void {
        this.radioGroup.removeRadioButton(this._id);
    }
}
