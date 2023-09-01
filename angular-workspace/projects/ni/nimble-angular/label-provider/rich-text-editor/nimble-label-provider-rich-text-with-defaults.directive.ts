import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { LabelProviderRichText } from '@ni/nimble-components/dist/esm/label-provider/rich-text';

import '@angular/localize/init';

/**
 * Directive for nimble-label-provider-rich-text which will initialize all of the labels with $localize-tagged strings, for apps
 * using @angular/localize.
 */
@Directive({
    selector: 'nimble-label-provider-rich-text[withDefaults]'
})
export class NimbleLabelProviderRichTextWithDefaultsDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderRichText>) {
        this.elementRef.nativeElement.toggleBold = $localize`:Nimble rich text - toggle bold|:Bold`;
        this.elementRef.nativeElement.toggleItalics = $localize`:Nimble rich text - toggle italics|:Italics`;
        this.elementRef.nativeElement.toggleBulletedList = $localize`:Nimble rich text - toggle bulleted list|:Bulleted List`;
        this.elementRef.nativeElement.toggleNumberedList = $localize`:Nimble rich text - toggle numbered list|:Numbered List`;
    }
}