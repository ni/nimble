import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TextArea } from '@ni/nimble-components/dist/esm/text-area';
import { TextAreaAppearance, TextAreaResize } from '@ni/nimble-components/dist/esm/text-area/types';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNumberProperty } from '../utilities/template-value-helpers';

export type { TextArea };
export { TextAreaAppearance, TextAreaResize };

/**
 * Directive to provide Angular integration for the text area
 */
@Directive({
    selector: 'nimble-text-area'
})
export class NimbleTextAreaDirective {
    public get appearance(): TextAreaAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: TextAreaAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get readOnly(): boolean {
        return this.elementRef.nativeElement.readOnly;
    }

    // readOnly property maps to the readonly attribute
    // See: https://github.com/microsoft/fast/blob/46bb6d9aab2c37105f4434db3795e176c2354a4f/packages/web-components/fast-foundation/src/text-area/text-area.ts#L22
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('readonly') public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    public get resize(): TextAreaResize {
        return this.elementRef.nativeElement.resize;
    }

    @Input() public set resize(value: TextAreaResize) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'resize', value);
    }

    public get autofocus(): boolean {
        return this.elementRef.nativeElement.autofocus;
    }

    @Input() public set autofocus(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'autofocus', toBooleanProperty(value));
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    // errorVisible property maps to the error-visible attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    // errorText property maps to the error-text attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get required(): boolean {
        return this.elementRef.nativeElement.required;
    }

    @Input() public set required(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'required', toBooleanProperty(value));
    }

    public get formId(): string {
        return this.elementRef.nativeElement.formId;
    }

    // formId property maps to the form attribute
    // See: https://github.com/microsoft/fast/blob/46bb6d9aab2c37105f4434db3795e176c2354a4f/packages/web-components/fast-foundation/src/text-area/text-area.ts#L63
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('form') public set formId(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'formId', value);
    }

    public get maxlength(): number {
        return this.elementRef.nativeElement.maxlength;
    }

    @Input() public set maxlength(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'maxlength', toNumberProperty(value));
    }

    public get minlength(): number {
        return this.elementRef.nativeElement.minlength;
    }

    @Input() public set minlength(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minlength', toNumberProperty(value));
    }

    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get cols(): number {
        return this.elementRef.nativeElement.cols;
    }

    @Input() public set cols(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'cols', toNumberProperty(value));
    }

    public get rows(): number {
        return this.elementRef.nativeElement.rows;
    }

    @Input() public set rows(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rows', toNumberProperty(value));
    }

    public get spellcheck(): boolean {
        return this.elementRef.nativeElement.spellcheck;
    }

    @Input() public set spellcheck(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'spellcheck', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TextArea>) {}
}
