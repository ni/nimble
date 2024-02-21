import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnIconDirective } from './nimble-table-column-icon.directive';

import '@ni/nimble-components/dist/esm/table-column/icon';

@NgModule({
    declarations: [NimbleTableColumnIconDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnIconDirective]
})
export class NimbleTableColumnIconModule { }
