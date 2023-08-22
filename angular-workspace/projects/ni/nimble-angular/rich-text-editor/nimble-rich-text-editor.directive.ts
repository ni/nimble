import { Directive, ElementRef } from '@angular/core';
import type { RichTextEditor } from '@ni/nimble-components/dist/esm/rich-text-editor';

export type { RichTextEditor };

/**
 * Directive to provide Angular integration for the rich text editor element.
 */
@Directive({
    selector: 'nimble-rich-text-editor'
})

export class NimbleRichTextEditorDirective {
    public constructor(private readonly elementRef: ElementRef<RichTextEditor>) { }

    public getMarkdown(): string {
        return this.elementRef.nativeElement.getMarkdown();
    }

    public setMarkdown(value: string): void {
        this.elementRef.nativeElement.setMarkdown(value);
    }
}
