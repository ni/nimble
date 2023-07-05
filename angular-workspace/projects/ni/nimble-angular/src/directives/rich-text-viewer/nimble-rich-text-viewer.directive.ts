import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import type { RichTextViewer } from '@ni/nimble-components/dist/esm/rich-text-viewer';

export type { RichTextViewer };

/**
 * Directive to provide Angular integration for the rich text viewer element.
 */
@Directive({
    selector: 'nimble-rich-text-viewer'
})

export class NimbleRichTextViewerDirective {
    @Input() public set markdownValue(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'markdownValue', value);
    }

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('fit-to-content') public set fitToContent(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fitToContent', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<RichTextViewer>) { }
}
