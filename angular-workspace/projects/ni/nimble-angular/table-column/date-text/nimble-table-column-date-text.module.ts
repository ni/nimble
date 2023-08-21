import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnDateTextDirective } from './nimble-table-column-date-text.directive';

import '@ni/nimble-components/dist/esm/table-column/text';

@NgModule({
    declarations: [NimbleTableColumnDateTextDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnDateTextDirective]
})
export class NimbleTableColumnDateTextModule { }
