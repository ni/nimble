import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnEnumTextDirective } from './nimble-table-column-enum-text.directive';

import '@ni/nimble-components/dist/esm/table-column/text';
import { NimbleMappingTextDirective } from './nimble-mapping-text.directive';

@NgModule({
    declarations: [NimbleTableColumnEnumTextDirective, NimbleMappingTextDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnEnumTextDirective, NimbleMappingTextDirective]
})
export class NimbleTableColumnEnumTextModule { }
