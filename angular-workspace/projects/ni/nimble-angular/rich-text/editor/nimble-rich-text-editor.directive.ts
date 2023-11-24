import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { RichTextEditor } from '@ni/nimble-components/dist/esm/rich-text/editor';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import type { RichTextValidity } from '@ni/nimble-components/dist/esm/rich-text/base/types';

export type { RichTextEditor, RichTextValidity };

/**
 * Directive to provide Angular integration for the rich text editor element.
 */
@Directive({
    selector: 'nimble-rich-text-editor'
})

export class NimbleRichTextEditorDirective {
    @Output() public inputEvent = new EventEmitter<boolean>();

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get footerHidden(): boolean {
        return this.elementRef.nativeElement.footerHidden;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('footer-hidden') public set footerHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'footerHidden', toBooleanProperty(value));
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get placeholder(): string | undefined {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get validity(): RichTextValidity {
        return this.elementRef.nativeElement.validity;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<RichTextEditor>) { }

    public getMarkdown(): string {
        return this.elementRef.nativeElement.getMarkdown();
    }

    public setMarkdown(value: string): void {
        this.elementRef.nativeElement.setMarkdown(value);
    }

    public get empty(): boolean {
        return this.elementRef.nativeElement.empty;
    }

    public checkValidity(): boolean {
        return this.elementRef.nativeElement.checkValidity();
    }

    @HostListener('input', ['$event'])
    public onInput($event: Event): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.inputEvent.emit();
        }
    }
}
