import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableDirective } from './nimble-table.directive';

import '@ni/nimble-components/dist/esm/table';

@NgModule({
    declarations: [NimbleTableDirective],
    imports: [CommonModule],
    exports: [NimbleTableDirective]
})
export class NimbleTableModule { }
