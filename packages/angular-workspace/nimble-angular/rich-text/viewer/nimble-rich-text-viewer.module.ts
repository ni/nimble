import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleRichTextViewerDirective } from './nimble-rich-text-viewer.directive';

import '@ni/nimble-components/dist/esm/rich-text/viewer';

@NgModule({
    declarations: [NimbleRichTextViewerDirective],
    imports: [CommonModule],
    exports: [NimbleRichTextViewerDirective]
})
export class NimbleRichTextViewerModule { }
