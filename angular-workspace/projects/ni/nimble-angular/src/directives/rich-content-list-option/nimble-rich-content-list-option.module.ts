import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@ni/nimble-components/dist/esm/rich-content-list-option';
import { NimbleComboboxRichContentListOptionDirective } from './nimble-combobox-rich-content-list-option.directive';

@NgModule({
    declarations: [NimbleComboboxRichContentListOptionDirective],
    imports: [CommonModule],
    exports: [NimbleComboboxRichContentListOptionDirective]
})
export class NimbleRichContentListOptionModule { }
