import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleListOptionDirective } from './nimble-list-option.directive';

import '@ni/nimble-components/dist/esm/list-option';

@NgModule({
    declarations: [NimbleListOptionDirective],
    imports: [CommonModule],
    exports: [NimbleListOptionDirective]
})
export class NimbleListOptionModule { }
