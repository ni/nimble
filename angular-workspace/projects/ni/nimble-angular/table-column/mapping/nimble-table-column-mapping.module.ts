import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnMappingDirective } from './nimble-table-column-mapping.directive';

import '@ni/nimble-components/dist/esm/table-column/mapping';

@NgModule({
    declarations: [NimbleTableColumnMappingDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnMappingDirective]
})
export class NimbleTableColumnMappingModule { }
