import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NimbleButtonComponent } from './nimble-button.component';

import '@ni/nimble-components/dist/esm/button';

@NgModule({
    declarations: [NimbleButtonComponent],
    imports: [CommonModule],
    providers: [],
    exports: [NimbleButtonComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NimbleButtonModule {}
