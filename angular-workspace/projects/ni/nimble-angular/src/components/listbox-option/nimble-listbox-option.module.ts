import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleListboxOptionDirective } from './nimble-listbox-option.directive';

import '@ni/nimble-components/dist/esm/listbox-option';

@NgModule({
    declarations: [NimbleListboxOptionDirective],
    imports: [CommonModule],
    exports: [NimbleListboxOptionDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NimbleListboxOptionModule { }
