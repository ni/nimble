import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnTextDirective } from './nimble-table-column-text.directive';

import '@ni/nimble-components/dist/esm/table-column/text';

@NgModule({
    declarations: [NimbleTableColumnTextDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnTextDirective]
})
export class NimbleTableColumnTextModule { }
