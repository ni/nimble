import { Directive } from '@angular/core';
import type { RichTextViewer } from '@ni/nimble-components/dist/esm/rich-text-viewer';

export type { RichTextViewer };

/**
 * Directive to provide Angular integration for the rich text viewer element.
 */
@Directive({
    selector: 'nimble-rich-text-viewer'
})

export class NimbleRichTextViewerDirective {

}
