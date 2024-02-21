import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnEnumTextDirective } from './nimble-table-column-enum-text.directive';

import '@ni/nimble-components/dist/esm/table-column/text';

@NgModule({
    declarations: [NimbleTableColumnEnumTextDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnEnumTextDirective]
})
export class NimbleTableColumnEnumTextModule { }
