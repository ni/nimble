import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { NimbleTextFieldComponent } from "./nimble-text-field.component";

import '@ni/nimble-components/dist/esm/text-field';

@NgModule({
    declarations: [NimbleTextFieldComponent],
    imports: [CommonModule],
    providers: [],
    exports: [NimbleTextFieldComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NimbleTextFieldModule {}
