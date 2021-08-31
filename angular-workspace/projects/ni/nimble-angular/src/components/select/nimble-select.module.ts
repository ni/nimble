import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleSelectComponent } from './nimble-select.component';

import '@ni/nimble-components/dist/esm/select';

@NgModule({
    declarations: [NimbleSelectComponent],
    imports: [CommonModule],
    exports: [NimbleSelectComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NimbleSelectModule { }
