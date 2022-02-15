import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TextArea } from '@ni/nimble-components/dist/esm/text-area';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { TextArea };

/**
 * Directive to provide Angular integration for the text area
 */
@Directive({
    selector: 'nimble-text-area'
})
export class NimbleTextAreaDirective {
    public get readOnly(): boolean {
        return this.elementRef.nativeElement.readOnly;
    }

    // readOnly property maps to the readonly attribute
    // See: https://github.com/microsoft/fast/blob/46bb6d9aab2c37105f4434db3795e176c2354a4f/packages/web-components/fast-foundation/src/text-area/text-area.ts#L22
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('readonly') public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    public get type(): TextAreaType {
        return this.elementRef.nativeElement.type;
    }

    @Input() public set type(value: TextFieldType | TextFieldTypeAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TextArea>) {}
}
