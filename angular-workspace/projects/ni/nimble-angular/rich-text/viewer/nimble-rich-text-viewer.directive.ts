import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { RichTextViewer } from '@ni/nimble-components/dist/esm/rich-text/viewer';
import type { RichTextValidity } from '@ni/nimble-components/dist/esm/rich-text/base/types';

export type { RichTextViewer };
export { RichTextValidity };

/**
 * Directive to provide Angular integration for the rich text viewer element.
 */
@Directive({
    selector: 'nimble-rich-text-viewer'
})

export class NimbleRichTextViewerDirective {
    @Input() public set markdown(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'markdown', value);
    }

    public get markdown(): string {
        return this.elementRef.nativeElement.markdown;
    }

    public get validity(): RichTextValidity {
        return this.elementRef.nativeElement.validity;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<RichTextViewer>) { }

    public getMentionedHrefs(): string[] {
        return this.elementRef.nativeElement.getMentionedHrefs();
    }

    public checkValidity(): boolean {
        return this.elementRef.nativeElement.checkValidity();
    }
}
