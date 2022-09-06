import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
import { TextFieldAppearance, TextFieldType } from '@ni/nimble-components/dist/esm/text-field/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { TextField };
export { TextFieldType, TextFieldAppearance };

/**
 * Directive to provide Angular integration for the text field
 */
@Directive({
    selector: 'nimble-text-field'
})
export class NimbleTextFieldDirective {
    public get appearance(): TextFieldAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: TextFieldAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

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

    @Input() public set type(value: TextFieldType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
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

    public get required(): boolean {
        return this.elementRef.nativeElement.required;
    }

    @Input() public set required(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'required', toBooleanProperty(value));
    }

    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get maxlength(): number {
        return this.elementRef.nativeElement.maxlength;
    }

    @Input() public set maxlength(value: number) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'maxlength', value);
    }

    public get minlength(): number {
        return this.elementRef.nativeElement.minlength;
    }

    @Input() public set minlength(value: number) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minlength', value);
    }

    public get pattern(): string {
        return this.elementRef.nativeElement.pattern;
    }

    @Input() public set pattern(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'pattern', value);
    }

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public get size(): number {
        return this.elementRef.nativeElement.size;
    }

    @Input() public set size(value: number) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
    }

    public get spellcheck(): boolean {
        return this.elementRef.nativeElement.spellcheck;
    }

    @Input() public set spellcheck(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'spellcheck', toBooleanProperty(value));
    }

    public get fullBleed(): boolean {
        return this.elementRef.nativeElement.fullBleed;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('full-bleed') public set fullBleed(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fullBleed', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TextField>) {}
}
