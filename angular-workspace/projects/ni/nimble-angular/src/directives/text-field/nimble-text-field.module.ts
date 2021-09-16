import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleTextFieldDirective } from './nimble-text-field.directive';

import '@ni/nimble-components/dist/esm/text-field';

@NgModule({
    declarations: [NimbleTextFieldDirective],
    imports: [CommonModule],
    providers: [],
    exports: [NimbleTextFieldDirective]
})
export class NimbleTextFieldModule {}
