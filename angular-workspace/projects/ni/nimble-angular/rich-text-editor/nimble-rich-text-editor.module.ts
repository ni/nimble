import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleRichTextEditorDirective } from './nimble-rich-text-editor.directive';

import '@ni/nimble-components/dist/esm/rich-text-editor';

@NgModule({
    declarations: [NimbleRichTextEditorDirective],
    imports: [CommonModule],
    exports: [NimbleRichTextEditorDirective]
})
export class NimbleRichTextEditorModule { }
