import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleLabelProviderRichTextDirective } from './nimble-label-provider-rich-text.directive';
import { NimbleLabelProviderRichTextWithDefaultsDirective } from './nimble-label-provider-rich-text-with-defaults.directive';

import '@ni/nimble-components/dist/esm/label-provider/rich-text';

@NgModule({
    declarations: [NimbleLabelProviderRichTextDirective, NimbleLabelProviderRichTextWithDefaultsDirective],
    imports: [
        CommonModule
    ],
    exports: [NimbleLabelProviderRichTextDirective, NimbleLabelProviderRichTextWithDefaultsDirective]
})
export class NimbleLabelProviderRichTextModule { }
