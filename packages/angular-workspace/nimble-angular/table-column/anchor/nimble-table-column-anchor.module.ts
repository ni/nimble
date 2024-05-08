import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnAnchorDirective } from './nimble-table-column-anchor.directive';
import { NimbleTableColumnAnchorNavigationGuardDirective } from './nimble-table-column-anchor-navigation-guard.directive';

import '@ni/nimble-components/dist/esm/table-column/anchor';

@NgModule({
    declarations: [NimbleTableColumnAnchorDirective, NimbleTableColumnAnchorNavigationGuardDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnAnchorDirective, NimbleTableColumnAnchorNavigationGuardDirective]
})
export class NimbleTableColumnAnchorModule { }
