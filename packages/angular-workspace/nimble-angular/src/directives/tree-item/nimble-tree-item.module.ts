import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTreeItemDirective } from './nimble-tree-item.directive';

import '@ni/nimble-components/dist/esm/tree-item';

@NgModule({
    declarations: [NimbleTreeItemDirective],
    imports: [CommonModule],
    exports: [NimbleTreeItemDirective]
})
export class NimbleTreeItemModule { }
