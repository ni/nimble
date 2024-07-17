import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnMenuButtonDirective } from './nimble-table-column-menu-button.directive';

import '@ni/nimble-components/dist/esm/table-column/menu-button';

@NgModule({
    declarations: [NimbleTableColumnMenuButtonDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnMenuButtonDirective]
})
export class NimbleTableColumnMenuButtonModule { }
