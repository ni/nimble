import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
import type { TextFieldTypeAttribute } from '@ni/nimble-components/dist/esm/text-field/types';
import { TextFieldType } from '@ni/nimble-components/dist/esm/text-field/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { TextField };
export { TextFieldType };

/**
 * Directive to provide Angular integration for the text field
 */
@Directive({
    selector: 'nimble-text-field'
})
export class NimbleTextFieldDirective {
    public get readOnly(): boolean {
        return this.elementRef.nativeElement.readOnly;
    }

    // readOnly property maps to the readonly attribute
    // See: https://github.com/microsoft/fast/blob/46bb6d9aab2c37105f4434db3795e176c2354a4f/packages/web-components/fast-foundation/src/text-field/text-field.ts#L33
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('readonly') public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    public get type(): TextFieldType {
        return this.elementRef.nativeElement.type;
    }

    @Input() public set type(value: TextFieldType | TextFieldTypeAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    public get errorText(): string {
        return this.elementRef.nativeElement.errorText;
    }

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-text') public set errorText(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TextField>) {}
}
