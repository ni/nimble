import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnNumberTextDirective } from './nimble-table-column-number-text.directive';

import '@ni/nimble-components/dist/esm/table-column/number-text';

@NgModule({
    declarations: [NimbleTableColumnNumberTextDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnNumberTextDirective]
})
export class NimbleTableColumnNumberTextModule { }
