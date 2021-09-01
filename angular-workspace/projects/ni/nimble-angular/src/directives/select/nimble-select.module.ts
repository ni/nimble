import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleSelectDirective } from './nimble-select.directive';

import '@ni/nimble-components/dist/esm/select';

@NgModule({
    declarations: [
        NimbleSelectDirective
    ],
    imports: [
        CommonModule
    ]
})
export class NimbleSelectModule { }
