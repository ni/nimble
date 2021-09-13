import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleListboxOptionDirective } from './nimble-listbox-option.directive';

import '@ni/nimble-components/dist/esm/listbox-option';

@NgModule({
    declarations: [NimbleListboxOptionDirective],
    imports: [CommonModule],
    exports: [NimbleListboxOptionDirective]
})
export class NimbleListboxOptionModule { }
