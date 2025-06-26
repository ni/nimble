import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnDurationTextDirective } from './nimble-table-column-duration-text.directive';

import '@ni/nimble-components/dist/esm/table-column/duration-text';

@NgModule({
    declarations: [NimbleTableColumnDurationTextDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnDurationTextDirective]
})
export class NimbleTableColumnDurationTextModule { }
