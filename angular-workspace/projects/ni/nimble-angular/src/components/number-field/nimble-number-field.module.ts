import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NimbleNumberFieldComponent } from './nimble-number-field.component';

import '@ni/nimble-components/dist/esm/src/number-field';

@NgModule({
    declarations: [NimbleNumberFieldComponent],
    imports: [CommonModule],
    providers: [],
    exports: [NimbleNumberFieldComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NimbleNumberFieldModule {}
