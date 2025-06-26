import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleListOptionGroupDirective } from './nimble-list-option-group.directive';

import '@ni/nimble-components/dist/esm/list-option';

@NgModule({
    declarations: [
        NimbleListOptionGroupDirective
    ],
    imports: [CommonModule],
    exports: [
        NimbleListOptionGroupDirective
    ]
})
export class NimbleListOptionGroupModule { }
