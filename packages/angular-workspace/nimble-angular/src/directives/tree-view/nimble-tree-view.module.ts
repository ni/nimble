import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTreeViewDirective } from './nimble-tree-view.directive';

import '@ni/nimble-components/dist/esm/tree-view';

@NgModule({
    declarations: [NimbleTreeViewDirective],
    imports: [CommonModule],
    exports: [NimbleTreeViewDirective]
})
export class NimbleTreeViewModule { }
